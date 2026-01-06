"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { put, del } from "@vercel/blob";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  wistiaVideoId: z.string().optional(),
  content: z.string().optional(),
  sectionId: z.string().min(1),
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
// LESSONS
// ============================================================================

export async function createLesson(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Lessons] Creating new lesson...");

    const rawData = {
      title: formData.get("title"),
      sectionId: formData.get("sectionId"),
    };

    const validatedData = lessonSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    // Get section to find courseId
    const section = await db.section.findUnique({
      where: { id: validatedData.data.sectionId },
    });

    if (!section) {
      return { success: false, error: "Section not found" };
    }

    // Get the highest order number
    const lastLesson = await db.lesson.findFirst({
      where: { sectionId: validatedData.data.sectionId },
      orderBy: { order: "desc" },
    });

    const lesson = await db.lesson.create({
      data: {
        title: validatedData.data.title,
        sectionId: validatedData.data.sectionId,
        order: (lastLesson?.order ?? -1) + 1,
      },
    });

    console.log("[Lessons] Lesson created successfully:", lesson.id);
    revalidatePath(`/admin/courses/${section.courseId}`);
    revalidatePath(`/admin/courses/${section.courseId}/sections`);
    return { success: true };
  } catch (error) {
    console.error("[Lessons] Error creating lesson:", error);
    return { success: false, error: "Failed to create lesson" };
  }
}

export async function updateLesson(
  lessonId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Lessons] Updating lesson:", lessonId);

    const rawData = {
      title: formData.get("title"),
      wistiaVideoId: formData.get("wistiaVideoId"),
      content: formData.get("content"),
      sectionId: "", // Not needed for update validation
    };

    const validatedData = lessonSchema
      .omit({ sectionId: true })
      .safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        title: validatedData.data.title,
        wistiaVideoId: validatedData.data.wistiaVideoId || null,
        content: validatedData.data.content || null,
      },
      include: { section: true },
    });

    console.log("[Lessons] Lesson updated successfully");
    revalidatePath(`/admin/courses/${lesson.section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Lessons] Error updating lesson:", error);
    return { success: false, error: "Failed to update lesson" };
  }
}

export async function deleteLesson(lessonId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Lessons] Deleting lesson:", lessonId);

    const lesson = await db.lesson.delete({
      where: { id: lessonId },
      include: { section: true, attachments: true },
    });

    // Delete attachments from blob storage
    for (const attachment of lesson.attachments) {
      try {
        await del(attachment.url);
      } catch {
        console.warn("[Lessons] Failed to delete attachment:", attachment.url);
      }
    }

    console.log("[Lessons] Lesson deleted successfully");
    revalidatePath(`/admin/courses/${lesson.section.courseId}`);
    redirect(`/admin/courses/${lesson.section.courseId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Lessons] Error deleting lesson:", error);
    return { success: false, error: "Failed to delete lesson" };
  }
}

export async function reorderLessons(
  sectionId: string,
  lessonIds: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Lessons] Reordering lessons...");

    const section = await db.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return { success: false, error: "Section not found" };
    }

    await Promise.all(
      lessonIds.map((id, index) =>
        db.lesson.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    console.log("[Lessons] Lessons reordered successfully");
    revalidatePath(`/admin/courses/${section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Lessons] Error reordering lessons:", error);
    return { success: false, error: "Failed to reorder lessons" };
  }
}

export async function renameLesson(
  lessonId: string,
  title: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Lessons] Renaming lesson:", lessonId);

    if (!title.trim()) {
      return { success: false, error: "Title is required" };
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: { title: title.trim() },
      include: { section: true },
    });

    console.log("[Lessons] Lesson renamed successfully");
    revalidatePath(`/admin/courses/${lesson.section.courseId}`);
    revalidatePath(`/admin/courses/${lesson.section.courseId}/sections`);
    return { success: true };
  } catch (error) {
    console.error("[Lessons] Error renaming lesson:", error);
    return { success: false, error: "Failed to rename lesson" };
  }
}

// ============================================================================
// ATTACHMENTS
// ============================================================================

export async function uploadAttachment(
  lessonId: string,
  formData: FormData
): Promise<ActionResult & { attachment?: { id: string; name: string; url: string } }> {
  try {
    await requireAdmin();
    console.log("[Attachments] Uploading attachment for lesson:", lessonId);

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });

    if (!lesson) {
      return { success: false, error: "Lesson not found" };
    }

    console.log("[Attachments] Uploading file to Vercel Blob...");
    const blob = await put(`attachments/${lessonId}/${file.name}`, file, {
      access: "public",
    });

    const attachment = await db.attachment.create({
      data: {
        name: file.name,
        url: blob.url,
        lessonId,
      },
    });

    console.log("[Attachments] Attachment uploaded successfully");
    revalidatePath(`/admin/courses/${lesson.section.courseId}`);
    return {
      success: true,
      attachment: { id: attachment.id, name: attachment.name, url: attachment.url },
    };
  } catch (error) {
    console.error("[Attachments] Error uploading attachment:", error);
    return { success: false, error: "Failed to upload attachment" };
  }
}

export async function deleteAttachment(
  attachmentId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Attachments] Deleting attachment:", attachmentId);

    const attachment = await db.attachment.delete({
      where: { id: attachmentId },
      include: { lesson: { include: { section: true } } },
    });

    // Delete from blob storage
    try {
      await del(attachment.url);
    } catch {
      console.warn("[Attachments] Failed to delete from blob storage");
    }

    console.log("[Attachments] Attachment deleted successfully");
    revalidatePath(`/admin/courses/${attachment.lesson.section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Attachments] Error deleting attachment:", error);
    return { success: false, error: "Failed to delete attachment" };
  }
}
