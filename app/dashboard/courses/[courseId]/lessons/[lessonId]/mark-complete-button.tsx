"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { markLessonComplete, unmarkLessonComplete } from "@/lib/actions/progress";

interface MarkCompleteButtonProps {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
}

export function MarkCompleteButton({
  lessonId,
  userId,
  isCompleted,
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isCompleted) {
        await unmarkLessonComplete(lessonId, userId);
      } else {
        await markLessonComplete(lessonId, userId);
      }
      router.refresh();
    } catch (error) {
      console.error("[MarkCompleteButton] Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isCompleted ? "outline" : "accent"}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isCompleted ? "Unmarking..." : "Marking..."}
        </>
      ) : isCompleted ? (
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
  );
}
