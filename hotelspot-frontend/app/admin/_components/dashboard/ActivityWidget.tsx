const ACTIONS = [
  {
    label: "Add Hotel",
    href: "/admin/hotels/create",
    icon: "🏨",
    color: "#C9A84C",
  },
  {
    label: "Add User",
    href: "/admin/users/create",
    icon: "👤",
    color: "#74c0fc",
  },
  { label: "Bookings", href: "/admin/bookings", icon: "📅", color: "#51cf66" },
  { label: "Reviews", href: "/admin/review", icon: "⭐", color: "#ffa94d" },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1">
        Shortcuts
      </p>
      <h3
        className="text-lg font-bold text-white mb-5"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {ACTIONS.map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/w hover:border-white/[0.14] hover:bg-white/4 transition-all duration-200 group"
          >
            <span className="text-lg">{a.icon}</span>
            <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors uppercase tracking-wide">
              {a.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

//  Upcoming check-ins / check-outs widget

interface UpcomingBooking {
  _id: string;
  userId?: { fullName?: string; email?: string } | string;
  hotelId?: { name?: string } | string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getGuest(b: UpcomingBooking) {
  if (!b.userId) return "Guest";
  if (typeof b.userId === "object")
    return b.userId.fullName || b.userId.email || "Guest";
  return "Guest";
}

function getHotel(b: UpcomingBooking) {
  if (!b.hotelId) return "—";
  if (typeof b.hotelId === "object") return b.hotelId.name || "—";
  return "—";
}

export function UpcomingWidget({
  checkIns,
  checkOuts,
}: {
  checkIns: UpcomingBooking[];
  checkOuts: UpcomingBooking[];
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1">
        Today
      </p>
      <h3
        className="text-lg font-bold text-white mb-5"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Upcoming
      </h3>

      {/* Check-ins */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a]">
            Check-ins ({checkIns.length})
          </p>
        </div>
        {checkIns.length === 0 ? (
          <p className="text-xs text-[#6b6b8a] pl-3.5">None upcoming</p>
        ) : (
          checkIns.slice(0, 3).map((b) => (
            <div
              key={b._id}
              className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-none"
            >
              <div className="min-w-0">
                <p className="text-xs text-white/80 truncate">{getGuest(b)}</p>
                <p className="text-[10px] text-[#6b6b8a] truncate">
                  {getHotel(b)}
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 shrink-0 ml-2">
                {formatDate(b.checkIn)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Check-outs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a]">
            Check-outs ({checkOuts.length})
          </p>
        </div>
        {checkOuts.length === 0 ? (
          <p className="text-xs text-[#6b6b8a] pl-3.5">None upcoming</p>
        ) : (
          checkOuts.slice(0, 3).map((b) => (
            <div
              key={b._id}
              className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-none"
            >
              <div className="min-w-0">
                <p className="text-xs text-white/80 truncate">{getGuest(b)}</p>
                <p className="text-[10px] text-[#6b6b8a] truncate">
                  {getHotel(b)}
                </p>
              </div>
              <span className="text-[10px] text-blue-400 shrink-0 ml-2">
                {formatDate(b.checkOut)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
