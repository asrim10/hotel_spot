const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.08]",
  pending: "text-amber-400  border-amber-500/20  bg-amber-500/[0.08]",
  cancelled: "text-red-400   border-red-500/20   bg-red-500/[0.08]",
  "checked-in": "text-blue-400  border-blue-500/20  bg-blue-500/[0.08]",
  "checked-out": "text-purple-400 border-purple-500/20 bg-purple-500/[0.08]",
};

interface Booking {
  _id: string;
  userId?: string;
  hotelId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  totalPrice?: number;
  status?: string;
  createdAt?: string;
}

const COLS = ["Guest", "Property", "Check-in", "Check-out", "Amount", "Status"];

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGuestName(userId: Booking["userId"]) {
  if (!userId) return "—";
  if (typeof userId === "object") return userId || "—";
  return "Guest";
}

function getHotelName(hotelId: Booking["hotelId"]) {
  if (!hotelId) return "—";
  if (typeof hotelId === "object") return hotelId || "—";
  return "Hotel";
}

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  const recent = bookings.slice(0, 7);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
            Latest Activity
          </p>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Recent Bookings
          </h3>
        </div>
        <a
          href="/admin/bookings"
          className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] hover:text-[#C9A84C] transition-colors"
        >
          View All →
        </a>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-4 px-6 py-3 border-b border-white/4 bg-white/1"
        style={{ gridTemplateColumns: "1.5fr 1.5fr 0.9fr 0.9fr 90px 110px" }}
      >
        {COLS.map((c) => (
          <span
            key={c}
            className="text-[9px] uppercase tracking-[0.15em] text-[#6b6b8a]"
          >
            {c}
          </span>
        ))}
      </div>

      {recent.length === 0 ? (
        <div className="py-16 text-center text-[#6b6b8a] text-sm">
          No bookings yet
        </div>
      ) : (
        recent.map((b) => (
          <div
            key={b._id}
            className="grid gap-4 px-6 py-4 items-center border-b border-white/3 last:border-none hover:bg-white/2 transition-colors"
            style={{
              gridTemplateColumns: "1.5fr 1.5fr 0.9fr 0.9fr 90px 110px",
            }}
          >
            <div className="min-w-0">
              <p className="text-sm text-white/80 truncate">
                {getGuestName(b.userId)}
              </p>
            </div>
            <span className="text-xs text-[#6b6b8a] truncate">
              {getHotelName(b.hotelId)}
            </span>
            <span className="text-xs text-[#6b6b8a]">
              {formatDate(b.checkInDate)}
            </span>
            <span className="text-xs text-[#6b6b8a]">
              {formatDate(b.checkOutDate)}
            </span>
            <span className="text-sm font-medium text-white/90">
              {b.totalPrice != null
                ? `Rs.${b.totalPrice.toLocaleString()}`
                : "—"}
            </span>
            <span
              className={`text-[10px] font-medium px-2.5 py-0.5 rounded border w-fit capitalize ${STATUS_STYLES[b.status || ""] || "text-[#6b6b8a] border-white/10 bg-white/5"}`}
            >
              {b.status || "—"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
