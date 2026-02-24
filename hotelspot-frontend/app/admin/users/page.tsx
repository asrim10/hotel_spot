import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const size = (params.size as string) || "10";
  const search = (params.search as string) || "";

  const response = await handleGetAllUsers(page, size, search as string);

  if (!response.success) {
    throw new Error(response.message || "Failed to load users");
  }

  return (
    <div>
      <Link
        href="/admin/users/create"
        className="border border-[#2a2a2a] text-[#9ca3af] text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors inline-block"
      >
        Create User
      </Link>
      <UserTable
        users={response.data}
        pagination={response.pagination}
        search={search}
      />
    </div>
  );
}
