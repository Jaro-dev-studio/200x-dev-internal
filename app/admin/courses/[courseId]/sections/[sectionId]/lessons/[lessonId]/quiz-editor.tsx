"use client";

import { useState } from "react";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { Quiz, Question } from "@prisma/client";

interface QuizEditorProps {
  lessonId: string;
  quiz:
    | (Quiz & {
        questions: Question[];
      })
    | null;
}

export function QuizEditor({ lessonId, quiz: initialQuiz }: QuizEditorProps) {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQuiz = async () => {
    setIsCreating(true);
    setError(null);
    const result = await createQuiz(lessonId);
    if (result.success && result.quizId) {
      setQuiz({
        id: result.quizId,
        lessonId,
        isMandatory: false,
        passingScore: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      });
    } else {
      setError(result.error || "Failed to create quiz");
    }
    setIsCreating(false);
  };

  const handleDeleteQuiz = async () => {
    if (!quiz || !confirm("Delete this quiz and all questions?")) return;
    const result = await deleteQuiz(quiz.id);
    if (result.success) {
      setQuiz(null);
    } else {
      setError(result.error || "Failed to delete quiz");
    }
  };

  const handleUpdateSettings = async () => {
    if (!quiz) return;
    setIsSaving(true);
    const result = await updateQuiz(quiz.id, {
      isMandatory: quiz.isMandatory,
      passingScore: quiz.passingScore,
    });
    if (!result.success) {
      setError(result.error || "Failed to update quiz");
    }
    setIsSaving(false);
  };

  if (!quiz) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No quiz for this lesson. Add a quiz to test student understanding.
        </p>
        <Button variant="accent" onClick={handleCreateQuiz} disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Quiz
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Quiz Settings */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h4 className="font-medium">Quiz Settings</h4>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isMandatory"
            checked={quiz.isMandatory}
            onChange={(e) =>
              setQuiz({ ...quiz, isMandatory: e.target.checked })
            }
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="isMandatory" className="text-sm">
            Mandatory (students must pass to continue)
          </label>
        </div>

        <Input
          type="number"
          label="Passing Score (%)"
          value={quiz.passingScore}
          onChange={(e) =>
            setQuiz({
              ...quiz,
              passingScore: parseInt(e.target.value) || 70,
            })
          }
          min={0}
          max={100}
        />

        <div className="flex gap-2">
          <Button
            variant="accent"
            size="sm"
            onClick={handleUpdateSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDeleteQuiz}>
            <Trash2 className="h-4 w-4" />
            Delete Quiz
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h4 className="font-medium">Questions</h4>

        {quiz.questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No questions yet. Add questions below.
          </p>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updated) => {
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.map((q) =>
                      q.id === question.id ? { ...q, ...updated } : q
                    ),
                  });
                }}
                onDelete={() => {
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.filter(
                      (q) => q.id !== question.id
                    ),
                  });
                }}
              />
            ))}
          </div>
        )}

        <NewQuestionForm
          quizId={quiz.id}
          onCreated={(question) => {
            setQuiz({
              ...quiz,
              questions: [
                ...quiz.questions,
                {
                  ...question,
                  quizId: quiz.id,
                  order: quiz.questions.length,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            });
          }}
        />
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (data: Partial<Question>) => void;
  onDelete: () => void;
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [text, setText] = useState(question.text);
  const [options, setOptions] = useState<string[]>(question.options as string[]);
  const [correctIndex, setCorrectIndex] = useState(question.correctIndex);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateQuestion(question.id, {
      text,
      options,
      correctIndex,
    });
    if (result.success) {
      onUpdate({ text, options, correctIndex });
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this question?")) return;
    const result = await deleteQuestion(question.id);
    if (result.success) {
      onDelete();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4 rounded-lg border border-border p-4">
        <Textarea
          label={`Question ${index + 1}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Options</label>
          {options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="h-4 w-4"
              />
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[i] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`Option ${i + 1}`}
              />
              {options.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const newOptions = options.filter((_, idx) => idx !== i);
                    setOptions(newOptions);
                    if (correctIndex >= newOptions.length) {
                      setCorrectIndex(newOptions.length - 1);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOptions([...options, ""])}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add Option
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="accent" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">
            {index + 1}. {question.text}
          </p>
          <ul className="mt-2 space-y-1">
            {(question.options as string[]).map((option, i) => (
              <li
                key={i}
                className={`text-sm ${
                  i === question.correctIndex
                    ? "font-medium text-green-500"
                    : "text-muted-foreground"
                }`}
              >
                {i === question.correctIndex ? "* " : "  "}
                {option}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NewQuestionFormProps {
  quizId: string;
  onCreated: (question: { id: string; text: string; options: string[]; correctIndex: number }) => void;
}

function NewQuestionForm({ quizId, onCreated }: NewQuestionFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleCreate = async () => {
    setIsCreating(true);
    const result = await createQuestion(quizId, {
      text,
      options: options.filter((o) => o.trim()),
      correctIndex,
    });
    if (result.success && result.question) {
      onCreated({
        id: result.question.id,
        text,
        options: options.filter((o) => o.trim()),
        correctIndex,
      });
      setText("");
      setOptions(["", ""]);
      setCorrectIndex(0);
      setIsAdding(false);
    }
    setIsCreating(false);
  };

  if (!isAdding) {
    return (
      <Button variant="outline" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4" />
        Add Question
      </Button>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <Textarea
        label="Question"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your question..."
        rows={2}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Options (select correct answer)
        </label>
        {options.map((option, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="new-correct"
              checked={correctIndex === i}
              onChange={() => setCorrectIndex(i)}
              className="h-4 w-4"
            />
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${i + 1}`}
            />
            {options.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const newOptions = options.filter((_, idx) => idx !== i);
                  setOptions(newOptions);
                  if (correctIndex >= newOptions.length) {
                    setCorrectIndex(newOptions.length - 1);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOptions([...options, ""])}
        >
          <Plus className="mr-2 h-3 w-3" />
          Add Option
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="accent" onClick={handleCreate} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Question"}
        </Button>
        <Button variant="outline" onClick={() => setIsAdding(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

