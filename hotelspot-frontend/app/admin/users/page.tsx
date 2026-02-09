import Link from "next/link";
import UserTable from "./_components/UserTable";

// Dummy data for testing
const DUMMY_USERS = [
  {
    _id: "1",
    username: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    role: "admin",
    imageUrl: "/uploads/dummy-avatar-1.png",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    fullName: "Jane Smith",
    role: "user",
    imageUrl: "/uploads/dummy-avatar-2.png",
    createdAt: "2024-01-20T14:45:00Z",
  },
  {
    _id: "3",
    username: "bob_wilson",
    email: "bob@example.com",
    fullName: "Bob Wilson",
    role: "user",
    createdAt: "2024-02-01T09:15:00Z",
  },
  {
    _id: "4",
    username: "alice_brown",
    email: "alice@example.com",
    fullName: "Alice Brown",
    role: "admin",
    imageUrl: "/uploads/dummy-avatar-4.png",
    createdAt: "2024-02-05T16:20:00Z",
  },
  {
    _id: "5",
    username: "charlie_davis",
    email: "charlie@example.com",
    role: "user",
    createdAt: "2024-02-10T11:30:00Z",
  },
];

export default async function Page() {
  const result = {
    success: true,
    data: DUMMY_USERS,
  };

  // Handle error case
  if (!result.success) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Link
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            href="/admin/users/create"
          >
            Create User
          </Link>
        </div>
        <div className="border border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded">
          <p className="text-red-600 dark:text-red-400">Error loading users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          href="/admin/users/create"
        >
          Create User
        </Link>
      </div>
      <UserTable users={result.data || []} />
    </div>
  );
}
