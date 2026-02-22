"use client";

interface BookingStats {
  total?: number;
  confirmed?: number;
  pending?: number;
  cancelled?: number;
  checkedIn?: number;
  checkedOut?: number;
  totalRevenue?: number;
}

const STATUS_CONFIG = [
  { key: "confirmed", label: "Confirmed", color: "#51cf66" },
  { key: "pending", label: "Pending", color: "#C9A84C" },
  { key: "checkedIn", label: "Checked In", color: "#74c0fc" },
  { key: "cancelled", label: "Cancelled", color: "#ff6b6b" },
  { key: "checkedOut", label: "Checked Out", color: "#e599f7" },
];

export function BookingStatusChart({ stats }: { stats: BookingStats }) {
  const total = stats.total || 0;
  const items = STATUS_CONFIG.map((s) => ({
    ...s,
    value: (stats as any)[s.key] || 0,
    pct:
      total > 0 ? Math.round((((stats as any)[s.key] || 0) / total) * 100) : 0,
  })).filter((i) => i.value > 0);

  const circumference = 2 * Math.PI * 54;
  let offset = 0;
  const segments = items.map((item) => {
    const dash = (item.pct / 100) * circumference;
    const seg = { ...item, dash, offset: circumference - offset };
    offset += dash + 2;
    return seg;
  });

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
        Breakdown
      </p>
      <h3
        className="text-lg font-bold text-white mb-5"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Booking Status
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width={128} height={128} viewBox="0 0 128 128">
            <circle
              cx={64}
              cy={64}
              r={54}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={12}
            />
            {segments.map((s) => (
              <circle
                key={s.key}
                cx={64}
                cy={64}
                r={54}
                fill="none"
                stroke={s.color}
                strokeWidth={12}
                strokeDasharray={`${s.dash - 2} ${circumference - s.dash + 2}`}
                strokeDashoffset={s.offset}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "64px 64px",
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-[22px] font-bold text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {total}
            </span>
            <span className="text-[9px] text-[#6b6b8a] uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {items.map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-xs text-[#6b6b8a]">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">
                  {s.value}
                </span>
                <span className="text-[10px] text-[#6b6b8a] w-7 text-right">
                  {s.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//  Users summary widget

interface User {
  _id: string;
  fullName?: string;
  email?: string;
  username?: string;
  role?: string;
  createdAt?: string;
  imageUrl?: string;
}

const PALETTE = ["#1a3a5c", "#1a3a2e", "#3a1a3a", "#2e2a1a", "#1a2e3a"];

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bg = PALETTE[name.charCodeAt(0) % PALETTE.length];
  return (
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold text-[#C9A84C]"
      style={{
        background: bg,
        border: "1.5px solid rgba(201,168,76,0.15)",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {initials}
    </div>
  );
}

export function RecentUsers({ users }: { users: User[] }) {
  const recent = users.slice(0, 6);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
            Members
          </p>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Recent Users
          </h3>
        </div>
        <a
          href="/admin/users"
          className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] hover:text-[#C9A84C] transition-colors"
        >
          View All →
        </a>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-[#6b6b8a]">No users yet</p>
      ) : (
        <div className="flex flex-col gap-0">
          {recent.map((u, i) => {
            const name = u.fullName || u.username || u.email || "User";
            return (
              <div
                key={u._id}
                className="flex items-center gap-3 py-3 border-b border-white/4 last:border-none"
              >
                <UserAvatar name={name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{name}</p>
                  <p className="text-[10px] text-[#6b6b8a] truncate">
                    {u.email}
                  </p>
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                    u.role === "admin"
                      ? "text-[#C9A84C] border-[#C9A84C]/20 bg-[#C9A84C]/8"
                      : "text-[#6b6b8a] border-white/10 bg-white/3"
                  }`}
                >
                  {u.role || "user"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
