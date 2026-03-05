import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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
import AdminDashboardPage from "@/app/admin/page";

jest.mock("@/lib/actions/admin/booking-action", () => ({
  handleGetAllBookingsAdmin: jest.fn(),
  handleGetBookingStatsAdmin: jest.fn(),
  handleGetUpcomingCheckInsAdmin: jest.fn(),
  handleGetUpcomingCheckOutsAdmin: jest.fn(),
}));
jest.mock("@/lib/actions/admin/hotel-action", () => ({
  handleGetAllHotels: jest.fn(),
}));
jest.mock("@/lib/actions/admin/user-action", () => ({
  handleGetAllUsers: jest.fn(),
}));
jest.mock("@/lib/actions/admin/review-action", () => ({
  handleGetAllReviews: jest.fn(),
  handleGetReviewAnalytics: jest.fn(),
}));

jest.mock("@/app/admin/_components/dashboard/StatCard", () => ({
  OverviewStrip: ({ items }: any) => (
    <div data-testid="overview-strip">
      {items.map((item: any) => (
        <div key={item.label} data-testid="overview-item">
          <span data-testid={`label-${item.label}`}>{item.label}</span>
          <span data-testid={`value-${item.label}`}>{item.value}</span>
        </div>
      ))}
    </div>
  ),
  StatCard: ({ label, value, sub }: any) => (
    <div data-testid="stat-card">
      <span data-testid={`label-${label}`}>{label}</span>
      <span data-testid={`value-${label}`}>{value}</span>
      {sub && <span data-testid={`sub-${label}`}>{sub}</span>}
    </div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/RevenueChart", () => ({
  RevenueChart: ({ totalRevenue, bookings }: any) => (
    <div data-testid="revenue-chart">
      <span data-testid="chart-revenue">{totalRevenue}</span>
      <span data-testid="chart-bookings-count">{bookings.length}</span>
    </div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/ActivityWidget", () => ({
  QuickActions: () => <div data-testid="quick-actions" />,
  UpcomingWidget: ({ checkIns, checkOuts }: any) => (
    <div data-testid="upcoming-widget">
      <span data-testid="checkins-count">{checkIns.length}</span>
      <span data-testid="checkouts-count">{checkOuts.length}</span>
    </div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/Charts", () => ({
  BookingStatusChart: ({ stats }: any) => (
    <div data-testid="booking-status-chart">{stats?.totalBookings ?? 0}</div>
  ),
  RecentUsers: ({ users }: any) => (
    <div data-testid="recent-users">{users.length}</div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/TopHotels", () => ({
  TopHotels: ({ hotels }: any) => (
    <div data-testid="top-hotels">{hotels.length}</div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/RecentBookings", () => ({
  RecentBookings: ({ bookings }: any) => (
    <div data-testid="recent-bookings">{bookings.length}</div>
  ),
}));
jest.mock("@/app/admin/_components/dashboard/RecentReviews", () => ({
  RecentReviews: ({ reviews }: any) => (
    <div data-testid="recent-reviews">{reviews.length}</div>
  ),
}));

const mockGetAllBookings = handleGetAllBookingsAdmin as jest.Mock;
const mockGetBookingStats = handleGetBookingStatsAdmin as jest.Mock;
const mockGetCheckIns = handleGetUpcomingCheckInsAdmin as jest.Mock;
const mockGetCheckOuts = handleGetUpcomingCheckOutsAdmin as jest.Mock;
const mockGetAllHotels = handleGetAllHotels as jest.Mock;
const mockGetAllUsers = handleGetAllUsers as jest.Mock;
const mockGetAllReviews = handleGetAllReviews as jest.Mock;
const mockGetReviewAnalytics = handleGetReviewAnalytics as jest.Mock;

const baseStats = {
  totalBookings: 20,
  totalRevenue: 5000,
  confirmedBookings: 10,
  pendingBookings: 4,
  cancelledBookings: 3,
  checkedInBookings: 3,
};

async function renderPage() {
  const Component = await AdminDashboardPage();
  return render(Component as React.ReactElement);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetAllBookings.mockResolvedValue({ success: true, data: [] });
  mockGetBookingStats.mockResolvedValue({ success: true, data: baseStats });
  mockGetCheckIns.mockResolvedValue({ success: true, data: [] });
  mockGetCheckOuts.mockResolvedValue({ success: true, data: [] });
  mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
  mockGetAllUsers.mockResolvedValue({ success: true, data: [] });
  mockGetAllReviews.mockResolvedValue({ success: true, data: [] });
  mockGetReviewAnalytics.mockResolvedValue({ success: true, data: {} });
});

describe("AdminDashboardPage", () => {
  describe("Page Header", () => {
    it("renders the Admin Panel label", async () => {
      await renderPage();
      expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });

    it("renders the Dashboard heading", async () => {
      await renderPage();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Dashboard",
      );
    });

    it("renders today's date string", async () => {
      await renderPage();
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      expect(screen.getByText(today)).toBeInTheDocument();
    });

    it("renders the Live indicator", async () => {
      await renderPage();
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    it("renders the Add Hotel link pointing to the create route", async () => {
      await renderPage();
      expect(screen.getByRole("link", { name: /add hotel/i })).toHaveAttribute(
        "href",
        "/admin/hotels/create",
      );
    });
  });

  describe("Overview Strip", () => {
    it("renders the Overview section label", async () => {
      await renderPage();
      expect(screen.getByText("Overview")).toBeInTheDocument();
    });

    it("renders all 6 KPI items", async () => {
      await renderPage();
      expect(screen.getAllByTestId("overview-item")).toHaveLength(6);
    });

    it("shows formatted revenue in the strip", async () => {
      await renderPage();
      expect(screen.getByTestId("value-Revenue")).toHaveTextContent("Rs.5k");
    });

    it("shows total bookings count in the strip", async () => {
      await renderPage();
      expect(screen.getByTestId("value-Bookings")).toHaveTextContent("20");
    });

    it("shows hotel count from API in the strip", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [{ _id: "h1" }, { _id: "h2" }],
      });
      await renderPage();
      expect(screen.getByTestId("value-Hotels")).toHaveTextContent("2");
    });

    it("shows user count from API in the strip", async () => {
      mockGetAllUsers.mockResolvedValue({
        success: true,
        data: [{ _id: "u1" }, { _id: "u2" }, { _id: "u3" }],
      });
      await renderPage();
      expect(screen.getByTestId("value-Users")).toHaveTextContent("3");
    });
  });

  describe("Stat Cards", () => {
    it("renders 4 stat cards", async () => {
      await renderPage();
      expect(screen.getAllByTestId("stat-card")).toHaveLength(4);
    });

    it("shows confirmed booking count", async () => {
      await renderPage();
      expect(screen.getByTestId("value-Confirmed")).toHaveTextContent("10");
    });

    it("shows cancelled booking count", async () => {
      await renderPage();
      expect(screen.getByTestId("value-Cancellations")).toHaveTextContent("3");
    });

    it("shows checked-in count", async () => {
      await renderPage();
      expect(screen.getByTestId("value-Checked In")).toHaveTextContent("3");
    });

    it("shows pending count in Confirmed sub-text", async () => {
      await renderPage();
      expect(screen.getByTestId("sub-Confirmed")).toHaveTextContent(
        "4 still pending",
      );
    });

    it("shows cancellation rate percentage in sub-text", async () => {
      await renderPage();
      expect(screen.getByTestId("sub-Cancellations")).toHaveTextContent(
        "15% rate",
      );
    });

    it("shows 0% rate in cancellation sub-text when no bookings", async () => {
      mockGetBookingStats.mockResolvedValue({
        success: true,
        data: { ...baseStats, totalBookings: 0, cancelledBookings: 0 },
      });
      await renderPage();
      expect(screen.getByTestId("sub-Cancellations")).toHaveTextContent(
        "0% rate",
      );
    });
  });

  describe("Revenue Formatting", () => {
    it("formats thousands as Rs.Xk", async () => {
      mockGetBookingStats.mockResolvedValue({
        success: true,
        data: { ...baseStats, totalRevenue: 15000 },
      });
      await renderPage();
      expect(screen.getByTestId("value-Revenue")).toHaveTextContent("Rs.15k");
    });

    it("formats millions as Rs.X.XM", async () => {
      mockGetBookingStats.mockResolvedValue({
        success: true,
        data: { ...baseStats, totalRevenue: 2500000 },
      });
      await renderPage();
      expect(screen.getByTestId("value-Revenue")).toHaveTextContent("Rs.2.5M");
    });

    it("shows raw value when revenue is below 1000", async () => {
      mockGetBookingStats.mockResolvedValue({
        success: true,
        data: { ...baseStats, totalRevenue: 500 },
      });
      await renderPage();
      expect(screen.getByTestId("value-Revenue")).toHaveTextContent("Rs.500");
    });
  });

  describe("Average Rating", () => {
    it("shows avg rating from reviewAnalytics when available", async () => {
      mockGetReviewAnalytics.mockResolvedValue({
        success: true,
        data: { averageRating: 4.3, totalReviews: 10 },
      });
      await renderPage();
      expect(screen.getByTestId("value-Avg Rating")).toHaveTextContent("4.3");
    });

    it("shows '—' when no reviews and no analytics data", async () => {
      mockGetReviewAnalytics.mockResolvedValue({ success: true, data: {} });
      mockGetAllReviews.mockResolvedValue({ success: true, data: [] });
      await renderPage();
      expect(screen.getByTestId("value-Avg Rating")).toHaveTextContent("—");
    });

    it("calculates avg rating from reviews when analytics has no averageRating", async () => {
      mockGetReviewAnalytics.mockResolvedValue({ success: true, data: {} });
      mockGetAllReviews.mockResolvedValue({
        success: true,
        data: [{ rating: 4 }, { rating: 5 }],
      });
      await renderPage();
      expect(screen.getByTestId("value-Avg Rating")).toHaveTextContent("4.5");
    });
  });

  describe("Child Components", () => {
    it("passes bookings to RevenueChart", async () => {
      mockGetAllBookings.mockResolvedValue({
        success: true,
        data: [{ _id: "b1" }, { _id: "b2" }],
      });
      await renderPage();
      expect(screen.getByTestId("chart-bookings-count")).toHaveTextContent("2");
    });

    it("passes checkIns and checkOuts to UpcomingWidget", async () => {
      mockGetCheckIns.mockResolvedValue({
        success: true,
        data: [{ _id: "ci1" }, { _id: "ci2" }],
      });
      mockGetCheckOuts.mockResolvedValue({
        success: true,
        data: [{ _id: "co1" }],
      });
      await renderPage();
      expect(screen.getByTestId("checkins-count")).toHaveTextContent("2");
      expect(screen.getByTestId("checkouts-count")).toHaveTextContent("1");
    });

    it("passes bookings to RecentBookings", async () => {
      mockGetAllBookings.mockResolvedValue({
        success: true,
        data: [{ _id: "b1" }, { _id: "b2" }, { _id: "b3" }],
      });
      await renderPage();
      expect(screen.getByTestId("recent-bookings")).toHaveTextContent("3");
    });

    it("passes reviews to RecentReviews", async () => {
      mockGetAllReviews.mockResolvedValue({
        success: true,
        data: [{ _id: "r1" }, { _id: "r2" }],
      });
      await renderPage();
      expect(screen.getByTestId("recent-reviews")).toHaveTextContent("2");
    });

    it("passes users to RecentUsers", async () => {
      mockGetAllUsers.mockResolvedValue({
        success: true,
        data: [{ _id: "u1" }],
      });
      await renderPage();
      expect(screen.getByTestId("recent-users")).toHaveTextContent("1");
    });

    it("renders QuickActions", async () => {
      await renderPage();
      expect(screen.getByTestId("quick-actions")).toBeInTheDocument();
    });

    it("renders TopHotels with hotel count", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [{ _id: "h1" }, { _id: "h2" }],
      });
      await renderPage();
      expect(screen.getByTestId("top-hotels")).toHaveTextContent("2");
    });
  });

  describe("Graceful Degradation", () => {
    it("falls back to zeros when all APIs fail", async () => {
      [
        mockGetAllBookings,
        mockGetBookingStats,
        mockGetCheckIns,
        mockGetCheckOuts,
        mockGetAllHotels,
        mockGetAllUsers,
        mockGetAllReviews,
        mockGetReviewAnalytics,
      ].forEach((m) => m.mockRejectedValue(new Error("fail")));
      await renderPage();
      expect(screen.getByTestId("value-Bookings")).toHaveTextContent("0");
      expect(screen.getByTestId("value-Hotels")).toHaveTextContent("0");
      expect(screen.getByTestId("value-Users")).toHaveTextContent("0");
    });

    it("falls back to zeros when bookingStats returns success:false", async () => {
      mockGetBookingStats.mockResolvedValue({ success: false });
      await renderPage();
      expect(screen.getByTestId("value-Confirmed")).toHaveTextContent("0");
      expect(screen.getByTestId("value-Cancellations")).toHaveTextContent("0");
      expect(screen.getByTestId("value-Checked In")).toHaveTextContent("0");
    });

    it("uses bookings array length as fallback when stats has no totalBookings", async () => {
      mockGetAllBookings.mockResolvedValue({
        success: true,
        data: [{ _id: "b1" }, { _id: "b2" }],
      });
      mockGetBookingStats.mockResolvedValue({ success: false });
      await renderPage();
      expect(screen.getByTestId("value-Bookings")).toHaveTextContent("2");
    });
  });
});
