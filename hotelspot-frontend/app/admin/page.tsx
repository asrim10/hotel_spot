import {
  handleGetAllBookingsAdmin,
  handleGetBookingStatsAdmin,
  handleGetUpcomingCheckInsAdmin,
  handleGetUpcomingCheckOutsAdmin,
} from "@/lib/actions/admin/booking-action";
import { handleGetAllHotels } from "@/lib/actions/admin/hotel-action";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import {
  handleGetAllReviews,
  handleGetReviewAnalytics,
} from "@/lib/actions/admin/review-action";
import { OverviewStrip, StatCard } from "./_components/dashboard/StatCard";
import { RevenueChart } from "./_components/dashboard/RevenueChart";
import {
  QuickActions,
  UpcomingWidget,
} from "./_components/dashboard/ActivityWidget";
import {
  BookingStatusChart,
  RecentUsers,
} from "./_components/dashboard/Charts";
import { TopHotels } from "./_components/dashboard/TopHotels";
import { RecentBookings } from "./_components/dashboard/RecentBookings";
import { RecentReviews } from "./_components/dashboard/RecentReviews";

export default async function AdminDashboardPage() {
  // ── Parallel data fetching ──────────────────────────────────────────────────
  const [
    bookingsRes,
    bookingStatsRes,
    checkInsRes,
    checkOutsRes,
    hotelsRes,
    usersRes,
    reviewsRes,
    reviewAnalyticsRes,
  ] = await Promise.allSettled([
    handleGetAllBookingsAdmin(),
    handleGetBookingStatsAdmin(),
    handleGetUpcomingCheckInsAdmin(),
    handleGetUpcomingCheckOutsAdmin(),
    handleGetAllHotels("1", "100"),
    handleGetAllUsers("1", "100"),
    handleGetAllReviews("1", "10"),
    handleGetReviewAnalytics(),
  ]);

  //  Safe unwrap helpers
  const ok = <T,>(res: PromiseSettledResult<any>, key = "data"): T =>
    res.status === "fulfilled" && res.value?.success
      ? (res.value[key] ?? [])
      : ([] as any);

  const bookings = ok<any[]>(bookingsRes, "data") ?? [];
  const bookingStats = ok<any>(bookingStatsRes, "data") ?? {};
  const checkIns = ok<any[]>(checkInsRes, "data") ?? [];
  const checkOuts = ok<any[]>(checkOutsRes, "data") ?? [];
  const hotels = ok<any[]>(hotelsRes, "data") ?? [];
  const users = ok<any[]>(usersRes, "data") ?? [];
  const reviews = ok<any[]>(reviewsRes, "data") ?? [];
  const reviewAnalytics = ok<any>(reviewAnalyticsRes, "data") ?? {};

  //  Derived metrics
  const totalRevenue = bookingStats?.totalRevenue ?? 0;
  const totalBookings = bookingStats?.total ?? bookings.length;
  const confirmedCount = bookingStats?.confirmed ?? 0;
  const pendingCount = bookingStats?.pending ?? 0;
  const cancelledCount = bookingStats?.cancelled ?? 0;
  const checkedInCount = bookingStats?.checkedIn ?? 0;
  const totalUsers = users.length;
  const totalHotels = hotels.length;
  const avgRating = reviewAnalytics?.averageRating
    ? Number(reviewAnalytics.averageRating).toFixed(1)
    : reviews.length > 0
      ? (
          reviews.reduce((a: number, r: any) => a + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "—";
  const totalReviews = reviewAnalytics?.totalReviews ?? reviews.length;

  const fmtRevenue =
    totalRevenue >= 1_000_000
      ? `Rs.${(totalRevenue / 1_000_000).toFixed(1)}M`
      : totalRevenue >= 1_000
        ? `Rs.${(totalRevenue / 1_000).toFixed(0)}k`
        : `Rs.${totalRevenue}`;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      <div
        className="w-full min-h-screen bg-[#0a0a0a] text-white px-8 py-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-370 mx-auto space-y-8">
          {/*  Header  */}
          <div className="fade-up flex items-end justify-between pb-6 border-b border-white/6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b8a] mb-2">
                Admin Panel
              </p>
              <h1
                className="text-[54px] font-bold leading-none uppercase text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-[#6b6b8a]">{today}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-emerald-400">
                  Live
                </span>
              </div>
              <a
                href="/admin/hotels/create"
                className="px-4 py-2 rounded-lg border border-[#C9A84C]/25 bg-[#C9A84C]/8 text-[11px] text-[#C9A84C] uppercase tracking-widest hover:bg-[#C9A84C]/15 transition-all"
              >
                + Add Hotel
              </a>
            </div>
          </div>

          {/*  Overview Strip — all 6 real KPIs  */}
          <div className="fade-up" style={{ animationDelay: "0.05s" }}>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-3">
              Overview
            </p>
            <OverviewStrip
              items={[
                {
                  label: "Revenue",
                  value: fmtRevenue,
                  icon: "💰",
                  accent: "#C9A84C",
                },
                {
                  label: "Bookings",
                  value: totalBookings,
                  icon: "📅",
                  accent: "#74c0fc",
                },
                {
                  label: "Hotels",
                  value: totalHotels,
                  icon: "🏨",
                  accent: "#51cf66",
                },
                {
                  label: "Users",
                  value: totalUsers,
                  icon: "👤",
                  accent: "#ffa94d",
                },
                {
                  label: "Reviews",
                  value: totalReviews,
                  icon: "⭐",
                  accent: "#C9A84C",
                },
                {
                  label: "Avg Rating",
                  value: avgRating,
                  icon: "✦",
                  accent: "#51cf66",
                },
              ]}
            />
          </div>

          {/*  KPI Cards  */}
          <div
            className="fade-up grid grid-cols-4 gap-4"
            style={{ animationDelay: "0.1s" }}
          >
            <StatCard
              label="Total Revenue"
              value={fmtRevenue}
              icon="💰"
              accent="#C9A84C"
              sub={`${totalBookings} bookings total`}
            />
            <StatCard
              label="Confirmed"
              value={confirmedCount}
              icon="✅"
              accent="#51cf66"
              sub={`${pendingCount} still pending`}
            />
            <StatCard
              label="Checked In"
              value={checkedInCount}
              icon="🏨"
              accent="#74c0fc"
              sub="Currently staying"
            />
            <StatCard
              label="Cancellations"
              value={cancelledCount}
              positive={false}
              icon="⚠️"
              accent="#ff6b6b"
              sub={
                totalBookings > 0
                  ? `${Math.round((cancelledCount / totalBookings) * 100)}% rate`
                  : "0% rate"
              }
            />
          </div>

          {/*  Revenue chart + upcoming  */}
          <div
            className="fade-up grid grid-cols-3 gap-4"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="col-span-2">
              <RevenueChart totalRevenue={totalRevenue} />
            </div>
            <UpcomingWidget checkIns={checkIns} checkOuts={checkOuts} />
          </div>

          {/*  Booking status + Hotels + Quick Actions  */}
          <div
            className="fade-up grid grid-cols-3 gap-4"
            style={{ animationDelay: "0.2s" }}
          >
            <BookingStatusChart stats={bookingStats} />
            <TopHotels hotels={hotels} />
            <QuickActions />
          </div>

          {/*  Recent Bookings full width  */}
          <div className="fade-up" style={{ animationDelay: "0.25s" }}>
            <RecentBookings bookings={bookings} />
          </div>

          {/*  Reviews + Recent Users  */}
          <div
            className="fade-up grid grid-cols-2 gap-4 pb-10"
            style={{ animationDelay: "0.3s" }}
          >
            <RecentReviews reviews={reviews} />
            <RecentUsers users={users} />
          </div>
        </div>
      </div>
    </>
  );
}
