import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link
        className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
        href="/admin/users/create"
      >
        Create User
      </Link>
    </div>
  );
}
