interface ReviewsToolbarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  ratingFilter: number;
  onRatingFilterChange: (val: number) => void;
  total: number;
}

const ReviewsToolbar = ({
  searchInput,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  total,
}: ReviewsToolbarProps) => (
  <div className="mb-6">
    {/* Section label */}
    <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-[#6b6b8a]">
      All Reviews
    </p>

    {/* Filter bar — matches bookings page */}
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/8">
      {/* Search */}
      <div className="relative flex-1 min-w-65">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b8a]"
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email, comment…"
          className="w-full bg-transparent border border-white/8 rounded-lg text-sm text-white/80 placeholder:text-[#6b6b8a] pl-10 pr-4 py-2.5 outline-none focus:border-[#C9A84C]/40 transition-colors"
        />
      </div>

      {/* Rating filter — styled like the dropdowns in bookings */}
      <div className="flex gap-2">
        {[0, 5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => onRatingFilterChange(r)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer
              ${
                ratingFilter === r
                  ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "border-white/8 bg-transparent text-[#6b6b8a] hover:border-white/20 hover:text-white/60"
              }`}
          >
            {r === 0 ? "All Stars" : `${r} ★`}
          </button>
        ))}
      </div>
    </div>

    {/* Showing count */}
    <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-[#6b6b8a]">
      Showing {total} {total === 1 ? "review" : "reviews"}
    </p>
  </div>
);

export default ReviewsToolbar;
