"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[Progress] Marking lesson complete:", lessonId);

    await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Get lesson to find course ID
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (lesson) {
      revalidatePath(`/dashboard/courses/${lesson.section.courseId}`);
    }
    revalidatePath("/dashboard");

    console.log("[Progress] Lesson marked complete successfully");
    return { success: true };
  } catch (error) {
    console.error("[Progress] Error marking lesson complete:", error);
    return { success: false, error: "Failed to mark lesson complete" };
  }
}

export async function unmarkLessonComplete(
  lessonId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[Progress] Unmarking lesson as complete:", lessonId);

    await db.lessonProgress.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        completed: false,
        completedAt: null,
      },
    });

    // Get lesson to find course ID
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (lesson) {
      revalidatePath(`/dashboard/courses/${lesson.section.courseId}`);
    }
    revalidatePath("/dashboard");

    console.log("[Progress] Lesson unmarked as complete successfully");
    return { success: true };
  } catch (error) {
    console.error("[Progress] Error unmarking lesson complete:", error);
    return { success: false, error: "Failed to unmark lesson complete" };
  }
}

