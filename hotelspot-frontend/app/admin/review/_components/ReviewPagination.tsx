interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

interface ReviewsPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const buildPageNumbers = (current: number, total: number): (number | "…")[] => {
  const delta = 2;
  const range: number[] = [];
  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(total, current + delta);
    i++
  ) {
    range.push(i);
  }
  const result: (number | "…")[] = [...range];
  if (range[0] > 1) {
    if (range[0] > 2) result.unshift("…");
    result.unshift(1);
  }
  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) result.push("…");
    result.push(total);
  }
  return result;
};

const ReviewsPagination = ({
  pagination,
  onPageChange,
}: ReviewsPaginationProps) => {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(page, totalPages);

  const baseBtn =
    "rounded-[9px] border border-white/[0.08] bg-white/[0.04] text-[#555577] text-sm transition-all duration-200 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 cursor-pointer";

  return (
    <div className="mt-5 flex justify-center items-center gap-1.5">
      {/* Prev */}
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${baseBtn} px-4 py-2 disabled:opacity-35 disabled:cursor-not-allowed`}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "…" ? (
          <span key={`e${idx}`} className="px-1 text-[#333355]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 ${baseBtn} ${
              p === page
                ? "border-[#C9A84C]/40! bg-[#C9A84C]/12! text-[#C9A84C]!"
                : ""
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${baseBtn} px-4 py-2 disabled:opacity-35 disabled:cursor-not-allowed`}
      >
        Next →
      </button>
    </div>
  );
};

export default ReviewsPagination;
