"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createSection,
  deleteSection,
  renameSection,
  reorderSections,
  toggleSectionVisibility,
  type ActionResult,
} from "@/lib/actions/courses";
import { createLesson as createLessonAction, renameLesson, deleteLessonFromList, reorderLessons } from "@/lib/actions/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Pencil, Check, X, GripVertical, Play, Paperclip, HelpCircle, AlignLeft, EyeOff, Eye } from "lucide-react";
import type { Section, Lesson, Quiz } from "@prisma/client";

interface LessonWithDetails extends Lesson {
  quiz: Quiz | null;
  _count: {
    attachments: number;
  };
}

interface SectionManagerProps {
  courseId: string;
  sections: (Section & { lessons: LessonWithDetails[] })[];
}

const initialState: ActionResult = {
  success: false,
};

interface SortableLessonProps {
  lesson: LessonWithDetails;
  courseId: string;
  sectionId: string;
  editingLessonId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onStartEditLesson: (lesson: LessonWithDetails) => void;
  onSaveLesson: (lessonId: string) => void;
  onCancelEdit: () => void;
  isPending: boolean;
}

function SortableLesson({
  lesson,
  courseId,
  sectionId,
  editingLessonId,
  editTitle,
  setEditTitle,
  onStartEditLesson,
  onSaveLesson,
  onCancelEdit,
  isPending,
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingLessonId === lesson.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
    >
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-7 flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveLesson(lesson.id);
              } else if (e.key === "Escape") {
                onCancelEdit();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onSaveLesson(lesson.id)}
            disabled={isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onCancelEdit}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </button>
            <Link
              href={`/admin/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`}
              className="flex flex-1 items-center gap-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              {lesson.title}
            </Link>
            <div className="flex items-center gap-1">
              {lesson.wistiaVideoId && (
                <Badge variant="accent" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <Play className="h-2.5 w-2.5" />
                  Video
                </Badge>
              )}
              {lesson.content && (
                <Badge variant="secondary" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <AlignLeft className="h-2.5 w-2.5" />
                  Content
                </Badge>
              )}
              {lesson._count.attachments > 0 && (
                <Badge variant="outline" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <Paperclip className="h-2.5 w-2.5" />
                  {lesson._count.attachments}
                </Badge>
              )}
              {lesson.quiz && (
                <Badge variant="default" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <HelpCircle className="h-2.5 w-2.5" />
                  Quiz
                </Badge>
              )}
              {lesson.isHidden && (
                <Badge variant="destructive" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <EyeOff className="h-2.5 w-2.5" />
                  Hidden
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                onStartEditLesson(lesson);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <form
              action={async () => {
                if (confirm("Delete this lesson?")) {
                  await deleteLessonFromList(lesson.id);
                }
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

interface SortableSectionProps {
  section: Section & { lessons: LessonWithDetails[] };
  courseId: string;
  isExpanded: boolean;
  onToggle: () => void;
  editingSectionId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  isPending: boolean;
  editingLessonId: string | null;
  onStartEditLesson: (lesson: LessonWithDetails) => void;
  onSaveLesson: (lessonId: string) => void;
  showNewLesson: string | null;
  setShowNewLesson: (id: string | null) => void;
  lessonAction: (payload: FormData) => void;
  lessonState: ActionResult;
  isLessonPending: boolean;
  onReorderLessons: (sectionId: string, lessonIds: string[]) => void;
}

function SortableSection({
  section,
  courseId,
  isExpanded,
  onToggle,
  editingSectionId,
  editTitle,
  setEditTitle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isPending,
  editingLessonId,
  onStartEditLesson,
  onSaveLesson,
  showNewLesson,
  setShowNewLesson,
  lessonAction,
  lessonState,
  isLessonPending,
  onReorderLessons,
}: SortableSectionProps) {
  const [orderedLessons, setOrderedLessons] = useState(section.lessons);

  const lessonSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setOrderedLessons(section.lessons);
  }, [section.lessons]);

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedLessons.findIndex((l) => l.id === active.id);
      const newIndex = orderedLessons.findIndex((l) => l.id === over.id);

      const newOrder = arrayMove(orderedLessons, oldIndex, newIndex);
      setOrderedLessons(newOrder);
      onReorderLessons(section.id, newOrder.map((l) => l.id));
    }
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingSectionId === section.id;

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border">
      <div
        className="flex cursor-pointer items-center justify-between p-3"
        onClick={() => !isEditing && onToggle()}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-7 w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSaveEdit();
                  } else if (e.key === "Escape") {
                    onCancelEdit();
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onSaveEdit}
                disabled={isPending}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onCancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="font-medium">{section.title}</span>
              <span className="text-sm text-muted-foreground">
                ({section.lessons.length} lessons)
              </span>
              {section.isHidden && (
                <Badge variant="destructive" className="gap-1 px-1.5 py-0.5 text-[10px]">
                  <EyeOff className="h-2.5 w-2.5" />
                  Hidden
                </Badge>
              )}
            </>
          )}
            </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {!isEditing && (
            <>
              <form action={async () => { await toggleSectionVisibility(section.id); }}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title={section.isHidden ? "Show section" : "Hide section"}
                >
                  {section.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </form>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onStartEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
            <form
              action={async () => {
                if (confirm("Delete this section and all its lessons?")) {
                  await deleteSection(section.id);
                }
              }}
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
          </div>

      {isExpanded && (
            <div className="border-t border-border p-3">
          {orderedLessons.length === 0 ? (
                <p className="mb-3 text-sm text-muted-foreground">
                  No lessons in this section yet.
                </p>
              ) : (
                <div className="mb-3 space-y-2">
              <DndContext
                sensors={lessonSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleLessonDragEnd}
              >
                <SortableContext
                  items={orderedLessons.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedLessons.map((lesson) => (
                    <SortableLesson
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      sectionId={section.id}
                      editingLessonId={editingLessonId}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onStartEditLesson={onStartEditLesson}
                      onSaveLesson={onSaveLesson}
                      onCancelEdit={onCancelEdit}
                      isPending={isPending}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
  );
}

export function SectionManager({ courseId, sections }: SectionManagerProps) {
  const [orderedSections, setOrderedSections] = useState(sections);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [showNewSection, setShowNewSection] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [sectionState, sectionAction, isSectionPending] = useActionState(
    createSection,
    initialState
  );

  const [lessonState, lessonAction, isLessonPending] = useActionState(
    createLessonAction,
    initialState
  );

  const handleStartEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditTitle(section.title);
    setEditingLessonId(null);
  };

  const handleStartEditLesson = (lesson: LessonWithDetails) => {
    setEditingLessonId(lesson.id);
    setEditTitle(lesson.title);
    setEditingSectionId(null);
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingLessonId(null);
    setEditTitle("");
  };

  const handleSaveSection = (sectionId: string) => {
    if (!editTitle.trim()) return;
    startTransition(async () => {
      await renameSection(sectionId, editTitle);
      setEditingSectionId(null);
      setEditTitle("");
    });
  };

  const handleSaveLesson = (lessonId: string) => {
    if (!editTitle.trim()) return;
    startTransition(async () => {
      await renameLesson(lessonId, editTitle);
      setEditingLessonId(null);
      setEditTitle("");
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedSections.findIndex((s) => s.id === active.id);
      const newIndex = orderedSections.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(orderedSections, oldIndex, newIndex);
      setOrderedSections(newOrder);

      startTransition(async () => {
        await reorderSections(courseId, newOrder.map((s) => s.id));
      });
    }
  };

  const handleReorderLessons = (sectionId: string, lessonIds: string[]) => {
    startTransition(async () => {
      await reorderLessons(sectionId, lessonIds);
    });
  };

  // Sync with prop changes (e.g., after server revalidation)
  useEffect(() => {
    setOrderedSections(sections);
  }, [sections]);

  return (
    <div className="space-y-4">
      {orderedSections.length === 0 && !showNewSection && (
        <p className="text-sm text-muted-foreground">
          No sections yet. Create your first section to start adding lessons.
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              courseId={courseId}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              editingSectionId={editingSectionId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onStartEdit={() => handleStartEditSection(section)}
              onSaveEdit={() => handleSaveSection(section.id)}
              onCancelEdit={handleCancelEdit}
              isPending={isPending}
              editingLessonId={editingLessonId}
              onStartEditLesson={handleStartEditLesson}
              onSaveLesson={handleSaveLesson}
              showNewLesson={showNewLesson}
              setShowNewLesson={setShowNewLesson}
              lessonAction={lessonAction}
              lessonState={lessonState}
              isLessonPending={isLessonPending}
              onReorderLessons={handleReorderLessons}
            />
          ))}
        </SortableContext>
      </DndContext>

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
