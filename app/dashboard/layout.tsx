import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth.protect({ unauthenticatedUrl: "/sign-up" });

  return children;
}
