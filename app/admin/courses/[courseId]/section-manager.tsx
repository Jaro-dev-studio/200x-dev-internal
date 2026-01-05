"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createSection,
  deleteSection,
  type ActionResult,
} from "@/lib/actions/courses";
import { createLesson as createLessonAction } from "@/lib/actions/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronRight, FileText } from "lucide-react";
import type { Section, Lesson } from "@prisma/client";

interface SectionManagerProps {
  courseId: string;
  sections: (Section & { lessons: Lesson[] })[];
}

const initialState: ActionResult = {
  success: false,
};

export function SectionManager({ courseId, sections }: SectionManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [showNewSection, setShowNewSection] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);

  const [sectionState, sectionAction, isSectionPending] = useActionState(
    createSection,
    initialState
  );

  const [lessonState, lessonAction, isLessonPending] = useActionState(
    createLessonAction,
    initialState
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {sections.length === 0 && !showNewSection && (
        <p className="text-sm text-muted-foreground">
          No sections yet. Create your first section to start adding lessons.
        </p>
      )}

      {sections.map((section) => (
        <div key={section.id} className="rounded-lg border border-border">
          <div
            className="flex cursor-pointer items-center justify-between p-3 hover:bg-muted/50"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-center gap-2">
              {expandedSections.has(section.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">{section.title}</span>
              <span className="text-sm text-muted-foreground">
                ({section.lessons.length} lessons)
              </span>
            </div>
            <form
              action={async () => {
                if (confirm("Delete this section and all its lessons?")) {
                  await deleteSection(section.id);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {expandedSections.has(section.id) && (
            <div className="border-t border-border p-3">
              {section.lessons.length === 0 ? (
                <p className="mb-3 text-sm text-muted-foreground">
                  No lessons in this section yet.
                </p>
              ) : (
                <div className="mb-3 space-y-2">
                  {section.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/admin/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}`}
                      className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {lesson.title}
                    </Link>
                  ))}
                </div>
              )}

              {showNewLesson === section.id ? (
                <form action={lessonAction} className="space-y-3">
                  <input type="hidden" name="sectionId" value={section.id} />
                  {lessonState.error && (
                    <p className="text-sm text-destructive">
                      {lessonState.error}
                    </p>
                  )}
                  <Input
                    name="title"
                    placeholder="Lesson title"
                    required
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button type="submit" variant="accent" size="sm" isLoading={isLessonPending}>
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewLesson(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewLesson(section.id)}
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add Lesson
                </Button>
              )}
            </div>
          )}
        </div>
      ))}

      {showNewSection ? (
        <form action={sectionAction} className="space-y-3 rounded-lg border border-border p-3">
          <input type="hidden" name="courseId" value={courseId} />
          {sectionState.error && (
            <p className="text-sm text-destructive">{sectionState.error}</p>
          )}
          <Input name="title" placeholder="Section title" required autoFocus />
          <div className="flex gap-2">
            <Button type="submit" variant="accent" size="sm" isLoading={isSectionPending}>
              Create Section
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewSection(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowNewSection(true)}>
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      )}
    </div>
  );
}

