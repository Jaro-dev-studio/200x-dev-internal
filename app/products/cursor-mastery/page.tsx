import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CursorMasteryClient } from "./client";

export const dynamic = "force-dynamic";

// The Advanced Cursor Mastery course ID
const CURSOR_MASTERY_COURSE_ID = "cmk0gfcb5000253k50ojad9wz";

export default async function CursorMasteryPage() {
  const session = await auth();

  const course = await db.course.findUnique({
    where: { id: CURSOR_MASTERY_COURSE_ID },
  });

  if (!course) {
    throw new Error("Course not found");
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
      vslVideoId={course.vslVideoId}
    />
  );
}
