import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const result = await handleWhoAmI();
  if (!result.success) throw new Error("Error fetching user data");
  if (!result.data) notFound();

  const user = result.data;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const initials = user.username?.charAt(0).toUpperCase();

  const rows = [
    { label: "Full Name", value: user.fullName || "Not set" },
    { label: "Username", value: user.username },
    { label: "Email Address", value: user.email },
    {
      label: "Account Type",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    },
    { label: "Account Created", value: formatDate(user.createdAt) },
    { label: "Last Updated", value: formatDate(user.updatedAt) },
  ];

  const stats = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Last Updated", value: formatDate(user.updatedAt) },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div
        className="min-h-screen bg-[#0a0a0a] text-white"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/*  Hero  */}
        <div className="relative h-[38vh] min-h-65border-b border-white/6 px-10 flex flex-col justify-end pb-10 overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-linear-to-b from-white/1 to-transparent pointer-events-none" />

          {/* Top row */}
          <div className="flex items-start justify-between mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b8a]">
              Your Profile
            </p>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1.5">
                Account Type
              </p>
              <p
                className="text-3xl font-bold uppercase text-white mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {user.role}
              </p>
              <p className="text-xs text-[#6b6b8a]">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Avatar + name */}
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="w-18 h-18rounded-full overflow-hidden border-2 border-[#2a2a2a] shrink-0">
              {user.imageUrl ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[#0a0a0a] text-[26px] font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Name + stats */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-[42px] font-bold leading-none text-white uppercase mb-4 truncate"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {user.fullName || user.username}
              </h1>
              <div className="flex gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
                      {s.label}
                    </p>
                    <p className="text-sm text-white/70 truncate">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit button */}
            <Link
              href="/user/profile/edit"
              className="shrink-0 px-5 py-2.5 rounded-lg border border-white/12 bg-transparent text-sm text-[#6b6b8a] uppercase tracking-widest hover:border-white/25 hover:text-white/80 transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/*  Body  */}
        <div className="max-w-215 mx-auto px-10 py-14">
          {/* Section header */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1.5">
              Account Details
            </p>
            <h2
              className="text-[32px] font-bold text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Personal Info
            </h2>
            <div className="mt-4 h-px bg-white/6" />
          </div>

          {/* Row list */}
          <div>
            {rows.map((row, i) => (
              <div
                key={i}
                className="flex items-baseline gap-8 py-4 border-b border-white/4 last:border-none"
              >
                <span className="w-44 shrink-0 text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a]">
                  {row.label}
                </span>
                <span className="text-sm text-white/70">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="mt-12 flex justify-end">
            <Link
              href="/user/profile/edit"
              className="px-5 py-2.5 rounded-lg border border-white/12 bg-transparent text-sm text-[#6b6b8a] uppercase tracking-widest hover:border-white/25 hover:text-white/80 transition-all"
            >
              + Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
