interface BookingSummaryStatsProps {
  bookings: any[];
}

export default function BookingSummaryStats({
  bookings,
}: BookingSummaryStatsProps) {
  const norm = (s: string) => (s || "").toLowerCase().trim();
  const isCompleted = (b: any) =>
    ["completed", "complete", "done", "checked_out", "checkedout"].includes(
      norm(b.status),
    );
  const isUpcoming = (b: any) =>
    ["upcoming", "confirmed", "booked", "pending", "active"].includes(
      norm(b.status),
    );

  const completed = bookings.filter(isCompleted);
  const upcoming = bookings.filter(isUpcoming);
  const totalSpent = completed.reduce(
    (s, b) => s + (b.totalAmount || b.totalPrice || 0),
    0,
  );

  const stats = [
    { value: bookings.length, label: "Total Bookings", accent: "#c9a96e" },
    { value: upcoming.length, label: "Upcoming Trips", accent: "#60a5fa" },
    { value: completed.length, label: "Completed Stays", accent: "#4ade80" },
    {
      value: `Rs. ${totalSpent.toLocaleString()}`,
      label: "Total Spent",
      accent: "#c9a96e",
    },
  ];

  return (
    <div
      className="grid border-t border-l border-[#1a1a1a] mt-16"
      style={{ gridTemplateColumns: "repeat(4,1fr)" }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[#0d0d0d] border-r border-b border-[#1a1a1a] p-8"
        >
          <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-4">
            {s.label}
          </p>
          <p
            className="text-white text-[36px] font-bold leading-none m-0"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {s.value}
          </p>
          <div
            className="w-5 h-0.5 mt-4"
            style={{ background: s.accent, opacity: 0.5 }}
          />
        </div>
      ))}
    </div>
  );
}
