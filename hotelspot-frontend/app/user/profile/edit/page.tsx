import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateUserForm from "../../_components/UpdateProfile";

export default async function EditProfilePage() {
  const result = await handleWhoAmI();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }

  if (!result.data) {
    notFound();
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <UpdateUserForm user={result.data} />
      </div>
    </div>
  );
}
