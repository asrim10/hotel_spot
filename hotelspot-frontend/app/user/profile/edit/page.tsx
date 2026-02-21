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
    <div
      className="flex-1 p-8"
      style={{ background: "#0a0a0a", minHeight: "100vh" }}
    >
      <UpdateUserForm user={result.data} />
    </div>
  );
}
