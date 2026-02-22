interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  size = 14,
  interactive = false,
  onChange,
}: StarRatingProps) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={s <= rating ? "#C9A84C" : "none"}
        stroke={s <= rating ? "#C9A84C" : "#3a3a52"}
        strokeWidth="1.5"
        className={`shrink-0 transition-all duration-150 ${
          interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
        }`}
        onClick={() => interactive && onChange?.(s)}
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </div>
);

export default StarRating;
