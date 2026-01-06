"use client";

import { useActionState } from "react";
import { updateCourse, deleteCourse, type ActionResult } from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import type { Course } from "@prisma/client";

interface CourseEditFormProps {
  course: Course;
}

const initialState: ActionResult = {
  success: false,
};

export function CourseEditForm({ course }: CourseEditFormProps) {
  const updateCourseWithId = updateCourse.bind(null, course.id);
  const [state, formAction, isPending] = useActionState(
    updateCourseWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
          Course updated successfully!
        </div>
      )}

      <Input
        name="title"
        label="Course Title"
        defaultValue={course.title}
        required
      />

      <Textarea
        name="description"
        label="Description"
        defaultValue={course.description || ""}
        rows={4}
      />

      <Input
        name="priceInCents"
        type="number"
        label="Price (in cents)"
        defaultValue={course.priceInCents}
        helperText="Enter price in cents. e.g., 4900 = $49.00"
        required
      />

      <Input
        name="thumbnail"
        type="url"
        label="Thumbnail URL"
        defaultValue={course.thumbnail || ""}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={course.published}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm">
          Published (visible to students)
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="accent" isLoading={isPending}>
          Save Changes
        </Button>
        <form
          action={async () => {
            if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
              await deleteCourse(course.id);
            }
          }}
        >
          <Button type="submit" variant="destructive">
            Delete Course
          </Button>
        </form>
      </div>
    </form>
  );
}
