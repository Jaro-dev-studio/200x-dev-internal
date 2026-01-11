"use client";

import { useActionState } from "react";
import { updateLesson, deleteLesson, type ActionResult } from "@/lib/actions/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import type { Lesson } from "@prisma/client";

interface LessonEditFormProps {
  lesson: Lesson;
}

const initialState: ActionResult = {
  success: false,
};

export function LessonEditForm({ lesson }: LessonEditFormProps) {
  const updateLessonWithId = updateLesson.bind(null, lesson.id);
  const [state, formAction, isPending] = useActionState(
    updateLessonWithId,
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
          Lesson updated successfully!
        </div>
      )}

      <Input
        name="title"
        label="Lesson Title"
        defaultValue={lesson.title}
        required
      />

      <Input
        name="wistiaVideoId"
        label="Wistia Video ID"
        defaultValue={lesson.wistiaVideoId || ""}
        placeholder="e.g., abc123xyz"
        helperText="Enter the Wistia video ID (found in the video URL or embed code)"
      />

      <Textarea
        name="content"
        label="Lesson Content"
        defaultValue={lesson.content || ""}
        rows={10}
        placeholder="Add your lesson content here. You can use markdown formatting."
        helperText="This content appears below the video"
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isHidden"
          name="isHidden"
          defaultChecked={lesson.isHidden}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="isHidden" className="text-sm">
          Hide lesson (won&apos;t be visible to students)
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="accent" isLoading={isPending}>
          Save Changes
        </Button>
        <form
          action={async () => {
            if (confirm("Are you sure you want to delete this lesson?")) {
              await deleteLesson(lesson.id);
            }
          }}
        >
          <Button type="submit" variant="destructive">
            Delete Lesson
          </Button>
        </form>
      </div>
    </form>
  );
}
