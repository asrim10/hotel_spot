import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  handleGetAllBookingsAdmin,
  handleGetBookingStatsAdmin,
} from "@/lib/actions/admin/booking-action";
import { toast } from "react-toastify";
import BookingsPage from "@/app/admin/bookings/page";

jest.mock("@/lib/actions/admin/booking-action", () => ({
  handleGetAllBookingsAdmin: jest.fn(),
  handleGetBookingStatsAdmin: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...p }: any) => (
      <div {...p}>{children}</div>
    ),
    button: ({
      children,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...p
    }: any) => <button {...p}>{children}</button>,
  },
}));
jest.mock("@/app/admin/bookings/_components/BookingStats", () => ({
  BookingStats: ({ stats, isLoading }: any) => (
    <div data-testid="booking-stats" data-loading={isLoading}>
      <span data-testid="stat-total">{stats.totalBookings}</span>
      <span data-testid="stat-confirmed">{stats.confirmedBookings}</span>
    </div>
  ),
}));
jest.mock("@/app/admin/bookings/_components/BookingTable", () => ({
  BookingTable: ({ bookings, isLoading, onActionComplete }: any) => (
    <div data-testid="booking-table" data-loading={isLoading}>
      <span data-testid="table-count">{bookings.length}</span>
      <button onClick={onActionComplete} data-testid="action-complete-btn">
        Complete Action
      </button>
    </div>
  ),
}));

const mockGetAllBookings = handleGetAllBookingsAdmin as jest.Mock;
const mockGetBookingStats = handleGetBookingStatsAdmin as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

const baseStats = {
  totalBookings: 10,
  confirmedBookings: 5,
  cancelledBookings: 2,
  pendingBookings: 1,
  checkedInBookings: 1,
  checkedOutBookings: 1,
};

const makeBooking = (overrides = {}) => ({
  _id: "b1",
  hotelId: "h1",
  fullName: "John Doe",
  email: "john@example.com",
  checkInDate: "2099-06-01",
  checkOutDate: "2099-06-05",
  totalPrice: 500,
  status: "confirmed",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetAllBookings.mockResolvedValue({ success: true, data: [] });
  mockGetBookingStats.mockResolvedValue({ success: true, data: baseStats });
});

describe("Admin BookingsPage", () => {
  describe("Page Structure", () => {
    it("renders the Admin Panel label", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByText("Admin Panel")).toBeInTheDocument(),
      );
    });

    it("renders the Bookings heading", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(
          screen.getByRole("heading", { level: 1, name: /bookings/i }),
        ).toBeInTheDocument(),
      );
    });

    it("renders the Overview label", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByText("Overview")).toBeInTheDocument(),
      );
    });

    it("renders the All Bookings label", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByText("All Bookings")).toBeInTheDocument(),
      );
    });

    it("renders the Refresh button", async () => {
      render(<BookingsPage />);
      expect(screen.getByText("Refresh")).toBeInTheDocument();
    });
  });

  describe("Data Fetching", () => {
    it("fetches bookings and stats on mount", async () => {
      render(<BookingsPage />);
      await waitFor(() => {
        expect(mockGetAllBookings).toHaveBeenCalledTimes(1);
        expect(mockGetBookingStats).toHaveBeenCalledTimes(1);
      });
    });

    it("passes fetched bookings to BookingTable", async () => {
      mockGetAllBookings.mockResolvedValue({
        success: true,
        data: [makeBooking({ _id: "b1" }), makeBooking({ _id: "b2" })],
      });
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByTestId("table-count")).toHaveTextContent("2"),
      );
    });

    it("passes fetched stats to BookingStats", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByTestId("stat-total")).toHaveTextContent("10"),
      );
    });

    it("shows error toast when bookings fetch fails", async () => {
      mockGetAllBookings.mockResolvedValue({
        success: false,
        message: "Server error",
      });
      render(<BookingsPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Server error"),
      );
    });

    it("shows error toast when fetch throws", async () => {
      mockGetAllBookings.mockRejectedValue(new Error("Network error"));
      render(<BookingsPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Network error"),
      );
    });
  });

  describe("Loading State", () => {
    it("passes isLoading=true to BookingStats while fetching", () => {
      mockGetAllBookings.mockReturnValue(new Promise(() => {}));
      mockGetBookingStats.mockReturnValue(new Promise(() => {}));
      render(<BookingsPage />);
      expect(screen.getByTestId("booking-stats")).toHaveAttribute(
        "data-loading",
        "true",
      );
    });

    it("passes isLoading=false to BookingTable after data loads", async () => {
      render(<BookingsPage />);
      await waitFor(() =>
        expect(screen.getByTestId("booking-table")).toHaveAttribute(
          "data-loading",
          "false",
        ),
      );
    });
  });

  describe("Refresh", () => {
    it("shows 'Refreshing...' text while refreshing", async () => {
      render(<BookingsPage />);
      await waitFor(() => screen.getByText("Refresh"));

      mockGetAllBookings.mockReturnValue(new Promise(() => {}));
      fireEvent.click(screen.getByText("Refresh"));

      expect(screen.getByText("Refreshing...")).toBeInTheDocument();
    });

    it("shows success toast after refresh completes", async () => {
      render(<BookingsPage />);
      await waitFor(() => screen.getByText("Refresh"));

      mockGetAllBookings.mockResolvedValue({ success: true, data: [] });
      mockGetBookingStats.mockResolvedValue({ success: true, data: baseStats });

      fireEvent.click(screen.getByText("Refresh"));

      await waitFor(() =>
        expect(mockToastSuccess).toHaveBeenCalledWith("Bookings refreshed"),
      );
    });

    it("disables the Refresh button while refreshing", async () => {
      render(<BookingsPage />);
      await waitFor(() => screen.getByText("Refresh"));

      mockGetAllBookings.mockReturnValue(new Promise(() => {}));
      fireEvent.click(screen.getByText("Refresh"));

      await waitFor(() =>
        expect(
          screen.getByText("Refreshing...").closest("button"),
        ).toBeDisabled(),
      );
    });

    it("re-fetches data when onActionComplete is triggered from BookingTable", async () => {
      render(<BookingsPage />);
      await waitFor(() => screen.getByTestId("action-complete-btn"));

      fireEvent.click(screen.getByTestId("action-complete-btn"));

      await waitFor(() => expect(mockGetAllBookings).toHaveBeenCalledTimes(2));
    });
  });
});
