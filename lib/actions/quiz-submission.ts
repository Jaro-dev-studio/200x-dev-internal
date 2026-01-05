"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface QuizSubmissionResult {
  success: boolean;
  error?: string;
  attempt?: {
    score: number;
    passed: boolean;
  };
}

export async function submitQuiz(
  quizId: string,
  userId: string,
  answers: number[]
): Promise<QuizSubmissionResult> {
  try {
    console.log("[Quiz Submission] Submitting quiz:", quizId);

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        lesson: {
          include: { section: true },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "Quiz not found" };
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctIndex) {
        correctAnswers++;
      }
    });

    const score =
      quiz.questions.length > 0
        ? Math.round((correctAnswers / quiz.questions.length) * 100)
        : 0;
    const passed = score >= quiz.passingScore;

    console.log(
      `[Quiz Submission] Score: ${score}%, Passed: ${passed}, Required: ${quiz.passingScore}%`
    );

    // Record attempt
    await db.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        passed,
        answers,
      },
    });

    // Revalidate paths
    revalidatePath(`/dashboard/courses/${quiz.lesson.section.courseId}`);
    revalidatePath("/dashboard");

    console.log("[Quiz Submission] Attempt recorded successfully");
    return {
      success: true,
      attempt: { score, passed },
    };
  } catch (error) {
    console.error("[Quiz Submission] Error:", error);
    return { success: false, error: "Failed to submit quiz" };
  }
}

