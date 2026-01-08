"use client";

import { createContext, useContext, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { markLessonComplete, unmarkLessonComplete } from "@/lib/actions/progress";

interface CompletionContextValue {
  isCompleted: boolean;
  isPending: boolean;
  onToggle: () => void;
}

const CompletionContext = createContext<CompletionContextValue | null>(null);

function useCompletion() {
  const context = useContext(CompletionContext);
  if (!context) {
    throw new Error("useCompletion must be used within CompletionProvider");
  }
  return context;
}

interface CompletionProviderProps {
  lessonId: string;
  userId: string;
  initialCompleted: boolean;
  children: React.ReactNode;
}

export function CompletionProvider({
  lessonId,
  userId,
  initialCompleted,
  children,
}: CompletionProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(initialCompleted);

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      try {
        if (initialCompleted) {
          await unmarkLessonComplete(lessonId, userId);
        } else {
          await markLessonComplete(lessonId, userId);
        }
        router.refresh();
      } catch (error) {
        console.error("[LessonCompletion] Error:", error);
      }
    });
  };

  return (
    <CompletionContext.Provider
      value={{
        isCompleted: optimisticCompleted,
        isPending,
        onToggle: handleToggle,
      }}
    >
      {children}
    </CompletionContext.Provider>
  );
}

export function LessonCompletionBadge() {
  const { isCompleted } = useCompletion();

  if (!isCompleted) return null;

  return (
    <div className="flex items-center gap-1.5 shrink-0 bg-green-500/15 text-green-500 px-3 py-1 rounded-full">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm font-medium">Completed</span>
    </div>
  );
}

export function LessonCompletionCard() {
  const { isCompleted, isPending, onToggle } = useCompletion();

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm sm:text-base">
          {isCompleted
            ? "You have completed this lesson"
            : "Mark this lesson as complete to continue"}
        </p>
        <Button
          variant={isCompleted ? "outline" : "accent"}
          onClick={onToggle}
          disabled={isPending}
        >
          {isCompleted ? (
            <>
              <Circle className="h-4 w-4" />
              Mark as Incomplete
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Mark as Complete
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
