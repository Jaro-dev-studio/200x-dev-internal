import path from "path";
import dotenv from "dotenv";
import { hash } from "bcryptjs";

// Load test environment
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

// Import Prisma client for seeding
import { PrismaClient } from "@prisma/client";

async function globalSetup() {
  console.log("[E2E Global Setup] Starting setup...");

  // Initialize Prisma client with test database
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Clean up existing data
    console.log("[E2E Global Setup] Cleaning up existing test data...");
    await prisma.quizAttempt.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.productPurchase.deleteMany();
    await prisma.coursePurchase.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.section.deleteMany();
    await prisma.course.deleteMany();
    await prisma.digitalProduct.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    console.log("[E2E Global Setup] Creating test users...");
    const passwordHash = await hash("TestPassword123!", 12);

    // Regular test user
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        passwordHash,
      },
    });

    // Admin user (using the admin email from middleware)
    await prisma.user.create({
      data: {
        email: "jaroslav.vorobey@gmail.com",
        name: "Admin User",
        passwordHash,
      },
    });

    // Create a test course with sections and lessons
    console.log("[E2E Global Setup] Creating test course...");
    const testCourse = await prisma.course.create({
      data: {
        title: "E2E Test Course",
        slug: "e2e-test-course",
        description: "A course created for end-to-end testing",
        priceInCents: 9900,
        published: true,
        requireSequentialProgress: true,
        sections: {
          create: [
            {
              title: "Getting Started",
              order: 0,
              lessons: {
                create: [
                  {
                    title: "Introduction",
                    content: "Welcome to the test course!",
                    order: 0,
                  },
                  {
                    title: "Setup Instructions",
                    content: "Here are the setup instructions.",
                    order: 1,
                  },
                ],
              },
            },
            {
              title: "Advanced Topics",
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Advanced Lesson",
                    content: "This is an advanced lesson.",
                    order: 0,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Create a digital product
    console.log("[E2E Global Setup] Creating test digital product...");
    const testProduct = await prisma.digitalProduct.create({
      data: {
        title: "E2E Test Product",
        slug: "e2e-test-product",
        description: "A digital product for testing",
        priceInCents: 4900,
        published: true,
        content: "This is the product content.",
      },
    });

    // Create purchases for the test user
    console.log("[E2E Global Setup] Creating test purchases...");
    await prisma.coursePurchase.create({
      data: {
        email: "test@example.com",
        userId: testUser.id,
        courseId: testCourse.id,
        stripeSessionId: "cs_test_e2e_course_purchase",
        amountPaid: 9900,
      },
    });

    await prisma.productPurchase.create({
      data: {
        email: "test@example.com",
        userId: testUser.id,
        productId: testProduct.id,
        stripeSessionId: "cs_test_e2e_product_purchase",
        amountPaid: 4900,
      },
    });

    console.log("[E2E Global Setup] Setup complete!");
    console.log("[E2E Global Setup] Test user: test@example.com / TestPassword123!");
    console.log("[E2E Global Setup] Admin user: jaroslav.vorobey@gmail.com / TestPassword123!");
  } catch (error) {
    console.error("[E2E Global Setup] Error during setup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
