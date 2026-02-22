type BadgeVariant = "default" | "gold" | "success" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-[#8888aa] border-white/10",
  gold: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Badge = ({ children, variant = "default" }: BadgeProps) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap tracking-wide ${variantClasses[variant]}`}
  >
    {children}
  </span>
);

export default Badge;
