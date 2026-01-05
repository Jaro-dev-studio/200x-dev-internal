import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CursorMasteryClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CursorMasteryPage() {
  const session = await auth();

  // First, ensure the course exists or create it
  let course = await db.course.findFirst({
    where: { title: "200x Dev - Cursor Mastery" },
  });

  // If course doesn't exist, create it
  if (!course) {
    course = await db.course.create({
      data: {
        title: "200x Dev - Cursor Mastery",
        description: "The Advanced Cursor Course. Be the replacer, not the replaced.",
        priceInCents: 99900,
        published: true,
      },
    });
  }

  // Check if user has purchased this course
  let hasPurchased = false;
  if (session?.user?.id) {
    const purchase = await db.coursePurchase.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
      },
    });
    hasPurchased = !!purchase;
  }

  return (
    <CursorMasteryClient
      courseId={course.id}
      priceInCents={course.priceInCents}
      hasPurchased={hasPurchased}
      isLoggedIn={!!session?.user}
    />
  );
}
