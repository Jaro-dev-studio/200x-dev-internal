"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { submitQuiz } from "@/lib/actions/quiz-submission";
import type { Quiz, Question, QuizAttempt } from "@prisma/client";

interface LessonQuizProps {
  quiz: Quiz & { questions: Question[] };
  userId: string;
  attempts: QuizAttempt[];
  hasPassedQuiz: boolean;
}

export function LessonQuiz({
  quiz,
  userId,
  attempts,
  hasPassedQuiz,
}: LessonQuizProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const answerArray = quiz.questions.map((q) => answers[q.id] ?? -1);

    const res = await submitQuiz(quiz.id, userId, answerArray);

    if (res.success && res.attempt) {
      setResult({
        score: res.attempt.score,
        passed: res.attempt.passed,
      });
      router.refresh();
    }

    setIsSubmitting(false);
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
    setIsStarted(true);
  };

  // Show results if already passed
  if (hasPassedQuiz && !isStarted) {
    const lastAttempt = attempts.find((a) => a.passed);
    return (
      <Card className="border-green-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-green-500">
            <CheckCircle className="h-5 w-5" />
            Quiz Passed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            You scored {lastAttempt?.score}% on this quiz.
          </p>
          <Button variant="outline" size="sm" onClick={resetQuiz}>
            <RefreshCw className="h-4 w-4" />
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show quiz result
  if (result) {
    return (
      <Card className={result.passed ? "border-green-500/50" : "border-red-500/50"}>
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 text-lg ${
              result.passed ? "text-green-500" : "text-red-500"
            }`}
          >
            {result.passed ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Quiz Passed!
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                Quiz Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You scored <strong>{result.score}%</strong>.
            {!result.passed && (
              <span>
                {" "}
                You need at least {quiz.passingScore}% to pass.
              </span>
            )}
          </p>
          {!result.passed && (
            <Button variant="outline" size="sm" onClick={resetQuiz}>
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show start button
  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quiz</CardTitle>
            {quiz.isMandatory && (
              <Badge variant="secondary">
                <AlertCircle className="mr-1 h-3 w-3" />
                Required
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {quiz.questions.length} questions. Passing score: {quiz.passingScore}
            %
          </p>
          {attempts.length > 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              Previous attempts: {attempts.length}. Best score:{" "}
              {Math.max(...attempts.map((a) => a.score))}%
            </p>
          )}
          <Button variant="accent" onClick={() => setIsStarted(true)}>Start Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  // Show quiz questions
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <div key={question.id} className="space-y-3">
            <p className="font-medium">
              {qIndex + 1}. {question.text}
            </p>
            <RadioGroup
              name={`question-${question.id}`}
              value={answers[question.id]}
              onValueChange={(value) =>
                setAnswers({ ...answers, [question.id]: value as number })
              }
            >
              {(question.options as string[]).map((option, oIndex) => (
                <RadioGroupItem key={oIndex} value={oIndex}>
                  {option}
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-2 pt-4">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              Object.keys(answers).length !== quiz.questions.length
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Quiz"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsStarted(false);
              setAnswers({});
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
