import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateUserForm from "../../_components/UpdateProfile";

export default async function EditProfilePage() {
  const result = await handleWhoAmI();
  if (!result.success) throw new Error("Error fetching user data");
  if (!result.data) notFound();

  return (
    <div className="flex-1 min-h-screen bg-[#0a0a0a] p-8">
      <UpdateUserForm user={result.data} />
    </div>
  );
}
