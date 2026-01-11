"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Package, Mail, Calendar, Search, X, Settings2 } from "lucide-react";
import { SignInAsButton } from "./sign-in-as-button";
import { ManageUserProductsModal } from "@/components/modals/manage-user-products-modal";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  coursePurchases: {
    id: string;
    amountPaid: number;
    course: {
      id: string;
      title: string;
    };
  }[];
  productPurchases: {
    id: string;
    amountPaid: number;
    product: {
      id: string;
      title: string;
      slug: string;
    };
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

type PurchaseFilter = "all" | "with-purchases" | "no-purchases";

interface UsersClientProps {
  users: User[];
  courses: Course[];
  products: Product[];
}

export function UsersClient({ users, courses, products }: UsersClientProps) {
  const [search, setSearch] = useState("");
  const [purchaseFilter, setPurchaseFilter] = useState<PurchaseFilter>("all");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [managedUser, setManagedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          user.email.toLowerCase().includes(searchLower) ||
          (user.name?.toLowerCase().includes(searchLower) ?? false);
        if (!matchesSearch) return false;
      }

      // Purchase filter
      const hasPurchases =
        user.coursePurchases.length > 0 || user.productPurchases.length > 0;
      if (purchaseFilter === "with-purchases" && !hasPurchases) return false;
      if (purchaseFilter === "no-purchases" && hasPurchases) return false;

      // Course filter
      if (selectedCourseId) {
        const hasCourse = user.coursePurchases.some(
          (p) => p.course.id === selectedCourseId
        );
        if (!hasCourse) return false;
      }

      // Product filter
      if (selectedProductId) {
        const hasProduct = user.productPurchases.some(
          (p) => p.product.id === selectedProductId
        );
        if (!hasProduct) return false;
      }

      return true;
    });
  }, [users, search, purchaseFilter, selectedCourseId, selectedProductId]);

  const clearFilters = () => {
    setSearch("");
    setPurchaseFilter("all");
    setSelectedCourseId(null);
    setSelectedProductId(null);
  };

  const hasActiveFilters =
    search ||
    purchaseFilter !== "all" ||
    selectedCourseId ||
    selectedProductId;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View all registered users and their purchases
          </p>
        </div>
        <Badge variant="secondary" className="text-sm w-fit">
          {filteredUsers.length} of {users.length} users
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Purchase Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Purchase Status</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={purchaseFilter === "all" ? "accent" : "outline"}
                size="sm"
                onClick={() => setPurchaseFilter("all")}
              >
                All Users
              </Button>
              <Button
                variant={purchaseFilter === "with-purchases" ? "accent" : "outline"}
                size="sm"
                onClick={() => setPurchaseFilter("with-purchases")}
              >
                With Purchases
              </Button>
              <Button
                variant={purchaseFilter === "no-purchases" ? "accent" : "outline"}
                size="sm"
                onClick={() => setPurchaseFilter("no-purchases")}
              >
                No Purchases
              </Button>
            </div>
          </div>

          {/* Course Filter */}
          {courses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Purchased Course</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCourseId === null ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCourseId(null)}
                >
                  Any
                </Button>
                {courses.map((course) => (
                  <Button
                    key={course.id}
                    variant={selectedCourseId === course.id ? "accent" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    {course.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Product Filter */}
          {products.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Purchased Product</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedProductId === null ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProductId(null)}
                >
                  Any
                </Button>
                {products.map((product) => (
                  <Button
                    key={product.id}
                    variant={selectedProductId === product.id ? "accent" : "outline"}
                    size="sm"
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    {product.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters ? "No users match your filters" : "No users yet"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl">
                    {user.name || "Unnamed User"}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined {user.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setManagedUser(user)}
                    >
                      <Settings2 className="h-4 w-4" />
                      Manage Access
                    </Button>
                    <SignInAsButton userId={user.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-foreground">
                      {user.coursePurchases.length}
                    </strong>{" "}
                    course{user.coursePurchases.length !== 1 ? "s" : ""} purchased
                  </span>
                  <span>
                    <strong className="text-foreground">
                      {user.productPurchases.length}
                    </strong>{" "}
                    product{user.productPurchases.length !== 1 ? "s" : ""} purchased
                  </span>
                </div>

                {(user.coursePurchases.length > 0 ||
                  user.productPurchases.length > 0) && (
                  <div className="space-y-3 border-t border-border pt-4">
                    {user.coursePurchases.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          Purchased Courses
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.coursePurchases.map((purchase) => (
                            <Badge key={purchase.id} variant="secondary">
                              {purchase.course.title}
                              <span className="ml-1 text-muted-foreground">
                                (${(purchase.amountPaid / 100).toFixed(2)})
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.productPurchases.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          Purchased Products
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.productPurchases.map((purchase) => (
                            <Badge key={purchase.id} variant="secondary">
                              {purchase.product.title}
                              <span className="ml-1 text-muted-foreground">
                                (${(purchase.amountPaid / 100).toFixed(2)})
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {managedUser && (
        <ManageUserProductsModal
          user={managedUser}
          courses={courses}
          products={products}
          open={!!managedUser}
          onOpenChange={(open) => !open && setManagedUser(null)}
        />
      )}
    </div>
  );
}
