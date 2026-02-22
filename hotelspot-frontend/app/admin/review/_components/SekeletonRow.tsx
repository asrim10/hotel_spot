interface SkeletonRowProps {
  index?: number;
}

const SkeletonRow = ({ index = 0 }: SkeletonRowProps) => (
  <div
    className="grid gap-4 px-6 py-4 border-b border-white/4"
    style={{ gridTemplateColumns: "2fr 1.5fr 2fr 1fr 0.8fr 90px" }}
  >
    {[70, 50, 110, 45, 55, 55].map((w, j) => (
      <div
        key={j}
        className="h-3 rounded bg-white/4 animate-pulse"
        style={{ width: `${w}%`, animationDelay: `${index * 0.08}s` }}
      />
    ))}
  </div>
);

export default SkeletonRow;
