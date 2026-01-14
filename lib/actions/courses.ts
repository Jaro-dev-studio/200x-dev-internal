"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  vslVideoId: z.string().optional(),
  priceInCents: z.coerce.number().min(0, "Price must be positive"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  published: z.coerce.boolean().optional(),
  requireSequentialProgress: z.coerce.boolean().optional(),
});

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  courseId: z.string().min(1),
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
// COURSES
// ============================================================================

export async function createCourse(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Courses] Creating new course...");

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      vslVideoId: formData.get("vslVideoId") || undefined,
      priceInCents: formData.get("priceInCents"),
      thumbnail: formData.get("thumbnail") || undefined,
    };

    const validatedData = courseSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const course = await db.course.create({
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description || null,
        vslVideoId: validatedData.data.vslVideoId || null,
        priceInCents: validatedData.data.priceInCents,
        thumbnail: validatedData.data.thumbnail || null,
      },
    });

    console.log("[Courses] Course created successfully:", course.id);
    revalidatePath("/admin/courses");
    redirect(`/admin/courses/${course.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Courses] Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(
  courseId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Courses] Updating course:", courseId);

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      vslVideoId: formData.get("vslVideoId") || undefined,
      priceInCents: formData.get("priceInCents"),
      thumbnail: formData.get("thumbnail") || undefined,
      published: formData.get("published") === "on",
      requireSequentialProgress: formData.get("requireSequentialProgress") === "on",
    };

    const validatedData = courseSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    await db.course.update({
      where: { id: courseId },
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description || null,
        vslVideoId: validatedData.data.vslVideoId || null,
        priceInCents: validatedData.data.priceInCents,
        thumbnail: validatedData.data.thumbnail || null,
        published: validatedData.data.published,
        requireSequentialProgress: validatedData.data.requireSequentialProgress,
      },
    });

    console.log("[Courses] Course updated successfully");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("[Courses] Error updating course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Courses] Deleting course:", courseId);

    await db.course.delete({
      where: { id: courseId },
    });

    console.log("[Courses] Course deleted successfully");
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Courses] Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

// ============================================================================
// SECTIONS
// ============================================================================

export async function createSection(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Creating new section...");

    const rawData = {
      title: formData.get("title"),
      courseId: formData.get("courseId"),
    };

    const validatedData = sectionSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    // Get the highest order number
    const lastSection = await db.section.findFirst({
      where: { courseId: validatedData.data.courseId },
      orderBy: { order: "desc" },
    });

    await db.section.create({
      data: {
        title: validatedData.data.title,
        courseId: validatedData.data.courseId,
        order: (lastSection?.order ?? -1) + 1,
      },
    });

    console.log("[Sections] Section created successfully");
    revalidatePath(`/admin/courses/${validatedData.data.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error creating section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateSection(
  sectionId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Updating section:", sectionId);

    const title = formData.get("title") as string;
    if (!title) {
      return { success: false, error: "Title is required" };
    }

    const section = await db.section.update({
      where: { id: sectionId },
      data: { title },
    });

    console.log("[Sections] Section updated successfully");
    revalidatePath(`/admin/courses/${section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error updating section:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Deleting section:", sectionId);

    const section = await db.section.delete({
      where: { id: sectionId },
    });

    console.log("[Sections] Section deleted successfully");
    revalidatePath(`/admin/courses/${section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error deleting section:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

export async function reorderSections(
  courseId: string,
  sectionIds: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Reordering sections...");

    await Promise.all(
      sectionIds.map((id, index) =>
        db.section.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    console.log("[Sections] Sections reordered successfully");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error reordering sections:", error);
    return { success: false, error: "Failed to reorder sections" };
  }
}

export async function renameSection(
  sectionId: string,
  title: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Renaming section:", sectionId);

    if (!title.trim()) {
      return { success: false, error: "Title is required" };
    }

    const section = await db.section.update({
      where: { id: sectionId },
      data: { title: title.trim() },
    });

    console.log("[Sections] Section renamed successfully");
    revalidatePath(`/admin/courses/${section.courseId}`);
    revalidatePath(`/admin/courses/${section.courseId}/sections`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error renaming section:", error);
    return { success: false, error: "Failed to rename section" };
  }
}

export async function toggleSectionVisibility(
  sectionId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Sections] Toggling section visibility:", sectionId);

    const section = await db.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return { success: false, error: "Section not found" };
    }

    const updatedSection = await db.section.update({
      where: { id: sectionId },
      data: { isHidden: !section.isHidden },
    });

    console.log("[Sections] Section visibility toggled to:", updatedSection.isHidden ? "hidden" : "visible");
    revalidatePath(`/admin/courses/${section.courseId}`);
    revalidatePath(`/admin/courses/${section.courseId}/sections`);
    return { success: true };
  } catch (error) {
    console.error("[Sections] Error toggling section visibility:", error);
    return { success: false, error: "Failed to toggle section visibility" };
  }
}
