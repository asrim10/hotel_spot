interface BookingSummaryStatsProps {
  bookings: any[];
}

export default function BookingSummaryStats({
  bookings,
}: BookingSummaryStatsProps) {
  // Normalize status for comparison
  const normalize = (s: string) => (s || "").toLowerCase().trim();

  const isCompleted = (b: any) =>
    ["completed", "complete", "done", "checked_out", "checkedout"].includes(
      normalize(b.status),
    );

  const isUpcoming = (b: any) =>
    ["upcoming", "confirmed", "booked", "pending", "active"].includes(
      normalize(b.status),
    );

  const completedBookings = bookings.filter(isCompleted);
  const upcomingBookings = bookings.filter(isUpcoming);

  const totalSpent = completedBookings.reduce(
    (sum, b) => sum + (b.totalAmount || b.totalPrice || 0),
    0,
  );

  const stats = [
    { value: bookings.length, label: "Total Bookings" },
    { value: upcomingBookings.length, label: "Upcoming Trips" },
    { value: completedBookings.length, label: "Completed Stays" },
    { value: `Rs.${totalSpent.toLocaleString()}`, label: "Total Spent" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <div className="text-3xl font-bold mb-2 text-gray-100">
            {stat.value}
          </div>
          <div className="text-gray-300 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
