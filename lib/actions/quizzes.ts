"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

