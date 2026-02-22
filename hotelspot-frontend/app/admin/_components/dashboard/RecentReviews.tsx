const PALETTE = ["#1a3a5c", "#1a3a2e", "#3a1a3a", "#2e2a1a"];

interface Review {
  _id: string;
  userId?: { fullName?: string; email?: string } | string;
  hotelId?: { name?: string } | string;
  rating?: number;
  createdAt?: string;
  fullName?: string;
  email?: string;
}

function Avatar({ name }: { name: string }) {
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
        border: "1.5px solid rgba(201,168,76,0.2)",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {initials}
    </div>
  );
}

function getGuest(r: Review) {
  if (r.fullName) return r.fullName;
  if (typeof r.userId === "object" && r.userId?.fullName)
    return r.userId.fullName;
  if (r.email) return r.email;
  if (typeof r.userId === "object" && r.userId?.email) return r.userId.email;
  return "Guest";
}

function getHotel(r: Review) {
  if (typeof r.hotelId === "object" && r.hotelId?.name) return r.hotelId.name;
  return "—";
}

function timeAgo(d?: string) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export function RecentReviews({ reviews }: { reviews: Review[] }) {
  const recent = reviews.slice(0, 4);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
            Guest Feedback
          </p>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Recent Reviews
          </h3>
        </div>
        <a
          href="/admin/review"
          className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] hover:text-[#C9A84C] transition-colors"
        >
          View All →
        </a>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-[#6b6b8a]">No reviews yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recent.map((r) => {
            const name = getGuest(r);
            return (
              <div
                key={r._id}
                className="p-4 rounded-xl border border-white/5 bg-white/1 hover:border-white/9 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-white/85 font-medium truncate">
                        {name}
                      </p>
                      <span className="text-[10px] text-[#6b6b8a] shrink-0 ml-2">
                        {timeAgo(r.createdAt)}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6b6b8a] mb-2">
                      {getHotel(r)}
                    </p>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          width={10}
                          height={10}
                          viewBox="0 0 24 24"
                          fill={s <= (r.rating || 0) ? "#C9A84C" : "none"}
                          stroke={s <= (r.rating || 0) ? "#C9A84C" : "#3a3a52"}
                          strokeWidth="1.5"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
