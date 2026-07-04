import { redirect } from "next/navigation";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  redirect("/user");
}
