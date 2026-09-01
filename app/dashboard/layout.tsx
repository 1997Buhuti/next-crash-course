import { auth } from "@clerk/nextjs/server";
import { ensureDefaultCategories } from "@/lib/db/categories";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth.protect({ unauthenticatedUrl: "/sign-up" });
  await ensureDefaultCategories(userId);

  return children;
}
