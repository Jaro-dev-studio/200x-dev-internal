"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCourse, type ActionResult } from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const initialState: ActionResult = {
  success: false,
};

export default function NewCoursePage() {
  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialState
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Course</h1>
          <p className="text-muted-foreground">
            Set up a new course for your students
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <Input
              name="title"
              label="Course Title"
              placeholder="e.g., Complete Web Development Bootcamp"
              required
            />

            <Textarea
              name="description"
              label="Description"
              placeholder="What will students learn in this course?"
              rows={4}
            />

            <Input
              name="priceInCents"
              type="number"
              label="Price (in cents)"
              placeholder="4900"
              defaultValue="0"
              helperText="Enter price in cents. e.g., 4900 = $49.00"
              required
            />

            <Input
              name="thumbnail"
              type="url"
              label="Thumbnail URL"
              placeholder="https://example.com/image.jpg"
            />

            <div className="flex gap-4">
              <Button type="submit" variant="accent" isLoading={isPending}>
                Create Course
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/courses">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

