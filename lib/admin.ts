// Admin email - users with this email have admin access
const ADMIN_EMAIL = "jaroslav.vorobey@gmail.com";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email === ADMIN_EMAIL;
}
