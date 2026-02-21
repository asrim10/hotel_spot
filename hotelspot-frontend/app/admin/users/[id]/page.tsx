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

  const user = response.data;
  const avatarSrc = user.imageUrl
    ? process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-[#1a1a1a] px-12 py-12 flex items-end justify-between">
        <div>
          <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
            Admin Panel
          </p>
          <h1
            className="text-white text-4xl font-bold uppercase leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            User Details
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-[#3a3a3a] hover:text-[#9ca3af] transition-colors"
          >
            ← Back
          </Link>
          <Link
            href={`/admin/users/${id}/edit`}
            className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Edit User
          </Link>
        </div>
      </div>

      <div className="px-12 py-12">
        <div className="flex items-center gap-8 pb-10 border-b border-[#1a1a1a] mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1a1a1a] shrink-0 bg-[#111] flex items-center justify-center">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-[#c9a96e] text-2xl font-bold"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {user.fullName?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-1">
              {user.role === "admin" ? "Administrator" : "Member"}
            </p>
            <h2
              className="text-white text-2xl font-bold"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {user.fullName}
            </h2>
            <p className="text-[#4b5563] text-sm mt-0.5">@{user.username}</p>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a]">
          {[
            { label: "Full Name", value: user.fullName },
            { label: "Email", value: user.email },
            { label: "Username", value: `@${user.username}` },
            { label: "Role", value: user.role, isRole: true },
          ].map(({ label, value, isRole }) => (
            <div
              key={label}
              className="grid grid-cols-[1fr_2fr] gap-12 py-7 border-b border-[#1a1a1a] items-center"
            >
              <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase">
                {label}
              </p>
              {isRole ? (
                <span
                  className={`text-[9px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 border w-fit ${
                    user.role === "admin"
                      ? "bg-[#161206] text-[#c9a96e] border-[#c9a96e33]"
                      : "bg-[#0d0d0d] text-[#6b7280] border-[#2a2a2a]"
                  }`}
                >
                  {value}
                </span>
              ) : (
                <p className="text-white text-sm font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
