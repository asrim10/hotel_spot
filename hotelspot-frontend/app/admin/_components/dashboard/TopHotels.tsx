const COLORS = [
  "#C9A84C",
  "#74c0fc",
  "#51cf66",
  "#ffa94d",
  "#ff6b6b",
  "#e599f7",
];

interface Hotel {
  _id: string;
  hotelName?: string;
  address?: string;
  price?: number;
  rating?: number;
  imageUrl?: string[];
}

export function TopHotels({ hotels }: { hotels: Hotel[] }) {
  const top = hotels.slice(0, 5);
  const maxPrice = Math.max(...top.map((h) => h.price || 0), 1);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-0.5">
            Inventory
          </p>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Properties
          </h3>
        </div>
        <a
          href="/admin/hotels"
          className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] hover:text-[#C9A84C] transition-colors"
        >
          Manage →
        </a>
      </div>

      {top.length === 0 ? (
        <p className="text-sm text-[#6b6b8a]">No hotels yet</p>
      ) : (
        <div className="flex flex-col gap-5">
          {top.map((h, i) => (
            <div key={h._id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded"
                    style={{
                      color: COLORS[i],
                      background: `${COLORS[i]}15`,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm text-white/85 leading-none">
                      {h.hotelName || "Unnamed"}
                    </p>
                    <p className="text-[10px] text-[#6b6b8a] mt-0.5">
                      {h.address || "—"}
                      {h.rating != null ? ` · ★ ${h.rating}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white/85">
                    {h.price != null ? `Rs.${h.price}/n` : "—"}
                  </p>
                </div>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${((h.price || 0) / maxPrice) * 100}%`,
                    background: COLORS[i],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
