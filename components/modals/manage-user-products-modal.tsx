"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Package, Check, Loader2 } from "lucide-react";
import {
  grantProductAccess,
  revokeProductAccess,
  grantCourseAccess,
  revokeCourseAccess,
} from "@/lib/actions/user";

interface User {
  id: string;
  email: string;
  name: string | null;
  coursePurchases: {
    course: {
      id: string;
    };
    amountPaid: number;
  }[];
  productPurchases: {
    product: {
      id: string;
    };
    amountPaid: number;
  }[];
}

interface Course {
  id: string;
  title: string;
}

interface Product {
  id: string;
  title: string;
}

interface ManageUserProductsModalProps {
  user: User;
  courses: Course[];
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageUserProductsModal({
  user,
  courses,
  products,
  open,
  onOpenChange,
}: ManageUserProductsModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const hasCourseAccess = (courseId: string) =>
    user.coursePurchases.some((p) => p.course.id === courseId);

  const hasProductAccess = (productId: string) =>
    user.productPurchases.some((p) => p.product.id === productId);

  const isAdminGrant = (id: string, type: "course" | "product") => {
    if (type === "course") {
      return user.coursePurchases.find((p) => p.course.id === id)?.amountPaid === 0;
    }
    return user.productPurchases.find((p) => p.product.id === id)?.amountPaid === 0;
  };

  const handleToggleCourse = (courseId: string) => {
    const hasAccess = hasCourseAccess(courseId);
    setLoadingId(courseId);
    startTransition(async () => {
      try {
        if (hasAccess) {
          await revokeCourseAccess(user.id, courseId);
        } else {
          await grantCourseAccess(user.id, courseId);
        }
        router.refresh();
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleToggleProduct = (productId: string) => {
    const hasAccess = hasProductAccess(productId);
    setLoadingId(productId);
    startTransition(async () => {
      try {
        if (hasAccess) {
          await revokeProductAccess(user.id, productId);
        } else {
          await grantProductAccess(user.id, productId);
        }
        router.refresh();
      } finally {
        setLoadingId(null);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Access: {user.name || user.email}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Courses */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Courses
            </div>
            <div className="grid gap-2">
              {courses.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 italic">No courses available</p>
              ) : (
                courses.map((course) => {
                  const hasAccess = hasCourseAccess(course.id);
                  const isLoading = loadingId === course.id;
                  const adminGrant = hasAccess && isAdminGrant(course.id, "course");

                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{course.title}</span>
                        {adminGrant && (
                          <Badge variant="secondary" className="w-fit text-[10px] h-4">
                            Admin Granted
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant={hasAccess ? "accent" : "outline"}
                        size="sm"
                        onClick={() => handleToggleCourse(course.id)}
                        disabled={isPending}
                        className="min-w-[110px]"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : hasAccess ? (
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Revoke</span>
                          </div>
                        ) : (
                          "Grant Access"
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              Digital Products
            </div>
            <div className="grid gap-2">
              {products.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 italic">No products available</p>
              ) : (
                products.map((product) => {
                  const hasAccess = hasProductAccess(product.id);
                  const isLoading = loadingId === product.id;
                  const adminGrant = hasAccess && isAdminGrant(product.id, "product");

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{product.title}</span>
                        {adminGrant && (
                          <Badge variant="secondary" className="w-fit text-[10px] h-4">
                            Admin Granted
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant={hasAccess ? "accent" : "outline"}
                        size="sm"
                        onClick={() => handleToggleProduct(product.id)}
                        disabled={isPending}
                        className="min-w-[110px]"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : hasAccess ? (
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Revoke</span>
                          </div>
                        ) : (
                          "Grant Access"
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
