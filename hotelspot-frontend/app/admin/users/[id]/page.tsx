import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
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
    <div>
      <Link href="/admin/users" className="text-blue-500 hover:underline">
        Back to Users
      </Link>
      <Link
        href={`/admin/users/${id}/edit`}
        className="text-green-500 hover:underline ml-4"
      >
        Edit User
      </Link>
      <h1 className="text-2xl font-bold mb-4 mt-2">User Details</h1>
      <div className="border border-gray-300 rounded-lg p-4">
        <p>
          <strong>Full Name:</strong> {response.data.fullName}
        </p>
        <p>
          <strong>Email:</strong> {response.data.email}
        </p>
        <p>
          <strong>Username:</strong> {response.data.username}
        </p>
        <p>
          <strong>Role:</strong> {response.data.role}
        </p>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
}
