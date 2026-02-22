interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const palette = [
  "#1a3a5c",
  "#1a3a2e",
  "#3a1a3a",
  "#2e2a1a",
  "#1a2e3a",
  "#2a1a2e",
];

const sizeClass = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

const Avatar = ({ name, size = "md" }: AvatarProps) => {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const bg = palette[(name?.charCodeAt(0) || 0) % palette.length];
  return (
    <div
      className={`${sizeClass[size]} rounded-full shrink-0 flex items-center justify-center font-semibold`}
      style={{
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
        border: "1.5px solid rgba(201,168,76,0.2)",
        color: "#C9A84C",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
