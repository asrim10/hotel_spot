import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import UpdateUserForm from "../../_components/UpdateUserForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await handleGetOneUser(id);

  if (!response.success) {
    throw new Error(response.message || "Failed to load user");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <UpdateUserForm user={response.data} />
    </div>
  );
}
