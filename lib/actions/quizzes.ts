"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import OpenAI from "openai";
import { env } from "@/env/server";
import { getWistiaTranscript } from "@/lib/wistia";

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
  correctIndex: z.coerce.number().min(0),
});

export interface ActionResult {
  success: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============================================================================
// QUIZ
// ============================================================================

export async function createQuiz(lessonId: string): Promise<ActionResult & { quizId?: string }> {
  try {
    await requireAdmin();
    console.log("[Quizzes] Creating quiz for lesson:", lessonId);

    // Check if quiz already exists
    const existingQuiz = await db.quiz.findUnique({
      where: { lessonId },
    });

    if (existingQuiz) {
      return { success: false, error: "Quiz already exists for this lesson" };
    }

    const quiz = await db.quiz.create({
      data: {
        lessonId,
        isMandatory: false,
        passingScore: 70,
      },
    });

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (lesson) {
      revalidatePath(`/admin/courses/${lesson.section.courseId}`);
    }

    console.log("[Quizzes] Quiz created successfully:", quiz.id);
    return { success: true, quizId: quiz.id };
  } catch (error) {
    console.error("[Quizzes] Error creating quiz:", error);
    return { success: false, error: "Failed to create quiz" };
  }
}

export async function updateQuiz(
  quizId: string,
  data: { isMandatory: boolean; passingScore: number }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Quizzes] Updating quiz:", quizId);

    const quiz = await db.quiz.update({
      where: { id: quizId },
      data: {
        isMandatory: data.isMandatory,
        passingScore: data.passingScore,
      },
      include: { lesson: { include: { section: true } } },
    });

    revalidatePath(`/admin/courses/${quiz.lesson.section.courseId}`);

    console.log("[Quizzes] Quiz updated successfully");
    return { success: true };
  } catch (error) {
    console.error("[Quizzes] Error updating quiz:", error);
    return { success: false, error: "Failed to update quiz" };
  }
}

export async function deleteQuiz(quizId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Quizzes] Deleting quiz:", quizId);

    const quiz = await db.quiz.delete({
      where: { id: quizId },
      include: { lesson: { include: { section: true } } },
    });

    revalidatePath(`/admin/courses/${quiz.lesson.section.courseId}`);

    console.log("[Quizzes] Quiz deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("[Quizzes] Error deleting quiz:", error);
    return { success: false, error: "Failed to delete quiz" };
  }
}

// ============================================================================
// QUESTIONS
// ============================================================================

export async function createQuestion(
  quizId: string,
  data: { text: string; options: string[]; correctIndex: number }
): Promise<ActionResult & { question?: { id: string } }> {
  try {
    await requireAdmin();
    console.log("[Questions] Creating question for quiz:", quizId);

    const validatedData = questionSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    // Get highest order
    const lastQuestion = await db.question.findFirst({
      where: { quizId },
      orderBy: { order: "desc" },
    });

    const question = await db.question.create({
      data: {
        quizId,
        text: validatedData.data.text,
        options: validatedData.data.options,
        correctIndex: validatedData.data.correctIndex,
        order: (lastQuestion?.order ?? -1) + 1,
      },
    });

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { lesson: { include: { section: true } } },
    });

    if (quiz) {
      revalidatePath(`/admin/courses/${quiz.lesson.section.courseId}`);
    }

    console.log("[Questions] Question created successfully:", question.id);
    return { success: true, question: { id: question.id } };
  } catch (error) {
    console.error("[Questions] Error creating question:", error);
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestion(
  questionId: string,
  data: { text: string; options: string[]; correctIndex: number }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Questions] Updating question:", questionId);

    const validatedData = questionSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const question = await db.question.update({
      where: { id: questionId },
      data: {
        text: validatedData.data.text,
        options: validatedData.data.options,
        correctIndex: validatedData.data.correctIndex,
      },
      include: { quiz: { include: { lesson: { include: { section: true } } } } },
    });

    revalidatePath(`/admin/courses/${question.quiz.lesson.section.courseId}`);

    console.log("[Questions] Question updated successfully");
    return { success: true };
  } catch (error) {
    console.error("[Questions] Error updating question:", error);
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteQuestion(questionId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Questions] Deleting question:", questionId);

    const question = await db.question.delete({
      where: { id: questionId },
      include: { quiz: { include: { lesson: { include: { section: true } } } } },
    });

    revalidatePath(`/admin/courses/${question.quiz.lesson.section.courseId}`);

    console.log("[Questions] Question deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("[Questions] Error deleting question:", error);
    return { success: false, error: "Failed to delete question" };
  }
}

// ============================================================================
// AI QUIZ GENERATION
// ============================================================================

interface GeneratedQuestionInput {
  text: string;
  options: string[];
  correctIndex: number;
}

interface GeneratedQuestion extends GeneratedQuestionInput {
  id: string;
}

interface GenerateQuizResult extends ActionResult {
  questions?: GeneratedQuestion[];
}

export async function generateQuizWithAI(
  lessonId: string,
  quizId: string,
  questionCount: number
): Promise<GenerateQuizResult> {
  try {
    await requireAdmin();
    console.log("[AI Quiz] Starting AI quiz generation for lesson:", lessonId);
    console.log("[AI Quiz] Requested question count:", questionCount);

    // Get lesson with video ID
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (!lesson) {
      return { success: false, error: "Lesson not found" };
    }

    if (!lesson.wistiaVideoId) {
      return { success: false, error: "This lesson does not have a video. Please add a video first." };
    }

    // Fetch transcript from Wistia
    console.log("[AI Quiz] Fetching transcript from Wistia...");
    const transcriptResult = await getWistiaTranscript(lesson.wistiaVideoId);
    
    if (transcriptResult.error || !transcriptResult.data) {
      return { success: false, error: transcriptResult.error || "Failed to fetch transcript" };
    }

    const transcript = transcriptResult.data;
    console.log("[AI Quiz] Transcript fetched successfully, length:", transcript.length);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    // Generate quiz questions using OpenAI
    console.log("[AI Quiz] Sending transcript to OpenAI for question generation...");
    
    const systemPrompt = `You are an expert educational content creator. Your task is to generate multiple-choice quiz questions based on video transcript content.

Rules:
- Create questions that test understanding of key concepts from the transcript
- Each question must have exactly 4 options
- Only one option should be correct
- Options should be plausible but clearly distinguishable
- Questions should be clear and unambiguous
- Avoid questions about timestamps or video-specific references
- Focus on educational content, concepts, and practical knowledge

Output format: Return a JSON array of question objects with this exact structure:
{
  "questions": [
    {
      "text": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}

The correctIndex is the 0-based index of the correct answer in the options array.`;

    const userPrompt = `Based on the following video transcript, generate exactly ${questionCount} multiple-choice quiz questions to test the viewer's understanding:

---
${transcript}
---

Generate ${questionCount} questions in the specified JSON format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      console.error("[AI Quiz] Empty response from OpenAI");
      return { success: false, error: "Failed to generate questions - empty response from AI" };
    }

    console.log("[AI Quiz] Parsing OpenAI response...");
    
    let parsedResponse: { questions: GeneratedQuestion[] };
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch {
      console.error("[AI Quiz] Failed to parse OpenAI response:", responseContent);
      return { success: false, error: "Failed to parse AI response" };
    }

    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      console.error("[AI Quiz] Invalid response structure:", parsedResponse);
      return { success: false, error: "Invalid response structure from AI" };
    }

    const generatedQuestions = parsedResponse.questions;
    console.log("[AI Quiz] Generated", generatedQuestions.length, "questions");

    // Validate and sanitize questions
    const validatedQuestions: GeneratedQuestionInput[] = [];
    for (const q of generatedQuestions) {
      if (
        typeof q.text === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === "number" &&
        q.correctIndex >= 0 &&
        q.correctIndex < 4
      ) {
        validatedQuestions.push({
          text: q.text,
          options: q.options.map(String),
          correctIndex: q.correctIndex,
        });
      }
    }

    if (validatedQuestions.length === 0) {
      return { success: false, error: "No valid questions generated" };
    }

    console.log("[AI Quiz] Validated", validatedQuestions.length, "questions");

    // Get current highest order
    const lastQuestion = await db.question.findFirst({
      where: { quizId },
      orderBy: { order: "desc" },
    });
    let currentOrder = (lastQuestion?.order ?? -1) + 1;

    // Create questions in database
    console.log("[AI Quiz] Creating questions in database...");
    
    const createdQuestions = await db.$transaction(
      validatedQuestions.map((q) =>
        db.question.create({
          data: {
            quizId,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            order: currentOrder++,
          },
        })
      )
    );

    console.log("[AI Quiz] Successfully created", createdQuestions.length, "questions");

    revalidatePath(`/admin/courses/${lesson.section.courseId}`);

    return {
      success: true,
      questions: createdQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options as string[],
        correctIndex: q.correctIndex,
      })),
    };
  } catch (error) {
    console.error("[AI Quiz] Error generating quiz:", error);
    return { success: false, error: "Failed to generate quiz questions" };
  }
}
