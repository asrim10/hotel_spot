import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getMyBookings } from "@/lib/api/booking";
import { getHotelById } from "@/lib/api/hotel";
import { handleDeleteBooking } from "@/lib/actions/booking-action";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import BookingHistoryPage from "@/app/user/booking/history/page";

jest.mock("@/lib/api/booking", () => ({ getMyBookings: jest.fn() }));
jest.mock("@/lib/api/hotel", () => ({ getHotelById: jest.fn() }));
jest.mock("@/lib/actions/booking-action", () => ({
  handleDeleteBooking: jest.fn(),
}));
jest.mock("@/app/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/app/BookingUtils", () => ({
  getLocationString: (h: any) =>
    [h?.city, h?.country].filter(Boolean).join(", "),
}));

jest.mock("@/app/user/booking/_components/BookingHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="booking-header" />,
}));
jest.mock("@/app/user/booking/_components/SearchFilter", () => ({
  __esModule: true,
  default: ({ searchQuery, onSearchChange }: any) => (
    <input
      data-testid="search-input"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search bookings..."
    />
  ),
}));
jest.mock("@/app/user/booking/_components/BookingTabs", () => ({
  __esModule: true,
  default: ({ activeTab, onTabChange }: any) => (
    <div>
      {["all", "confirmed", "cancelled"].map((tab) => (
        <button key={tab} onClick={() => onTabChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  ),
}));
jest.mock("@/app/user/booking/_components/BookingCard", () => ({
  __esModule: true,
  default: ({ booking, onCancel }: any) => (
    <div data-testid="booking-card" data-id={booking._id}>
      <span>{booking.hotelName || booking._id}</span>
      <button onClick={() => onCancel(booking._id)}>Cancel</button>
    </div>
  ),
}));
jest.mock("@/app/user/booking/_components/BookingSummary", () => ({
  __esModule: true,
  default: () => <div data-testid="booking-summary" />,
}));

const mockGetMyBookings = getMyBookings as jest.Mock;
const mockHandleDeleteBooking = handleDeleteBooking as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

const makeBooking = (overrides = {}) => ({
  _id: "b1",
  hotelName: "Grand Palace",
  hotelId: "h1",
  status: "confirmed",
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ user: { id: "u1" } });
  (getHotelById as jest.Mock).mockResolvedValue({ success: true, data: {} });
});

describe("BookingHistoryPage", () => {
  describe("Loading State", () => {
    it("shows 3 skeleton loaders while bookings are being fetched", () => {
      mockGetMyBookings.mockReturnValue(new Promise(() => {}));
      render(<BookingHistoryPage />);
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(3);
    });

    it("hides skeletons after bookings load", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [makeBooking()],
      });
      render(<BookingHistoryPage />);
      await waitFor(() =>
        expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0),
      );
    });
  });

  describe("Auth Guard", () => {
    it("does not fetch bookings when user is not logged in", () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<BookingHistoryPage />);
      expect(mockGetMyBookings).not.toHaveBeenCalled();
    });

    it("fetches bookings when user is present", async () => {
      mockGetMyBookings.mockResolvedValue({ success: true, data: [] });
      render(<BookingHistoryPage />);
      await waitFor(() => expect(mockGetMyBookings).toHaveBeenCalledTimes(1));
    });
  });

  describe("Empty State", () => {
    it("shows 'No Bookings Yet' when there are no bookings", async () => {
      mockGetMyBookings.mockResolvedValue({ success: true, data: [] });
      render(<BookingHistoryPage />);
      await waitFor(() =>
        expect(screen.getByText("No Bookings Yet")).toBeInTheDocument(),
      );
    });

    it("shows 'No Bookings Found' when search has a value and no results match", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [makeBooking({ hotelName: "Grand Palace" })],
      });
      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "xyznonexistent" },
      });

      expect(screen.getByText("No Bookings Found")).toBeInTheDocument();
    });
  });

  describe("Booking Rendering", () => {
    it("renders a booking card for each booking", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [
          makeBooking({ _id: "b1", hotelName: "Grand Palace" }),
          makeBooking({ _id: "b2", hotelName: "Ocean Breeze" }),
        ],
      });
      render(<BookingHistoryPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("booking-card")).toHaveLength(2),
      );
    });

    it("shows error toast when fetch throws", async () => {
      mockGetMyBookings.mockRejectedValue(new Error("Network error"));
      render(<BookingHistoryPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Network error"),
      );
    });
  });

  describe("Tab Filtering", () => {
    it("filters bookings by status when a tab is selected", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [
          makeBooking({ _id: "b1", status: "confirmed" }),
          makeBooking({ _id: "b2", status: "cancelled" }),
        ],
      });
      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.click(screen.getByText("confirmed"));

      expect(screen.getAllByTestId("booking-card")).toHaveLength(1);
      expect(screen.getByTestId("booking-card").getAttribute("data-id")).toBe(
        "b1",
      );
    });
  });

  describe("Search", () => {
    it("filters bookings by hotel name", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [
          makeBooking({ _id: "b1", hotelName: "Grand Palace" }),
          makeBooking({ _id: "b2", hotelName: "Ocean Breeze" }),
        ],
      });
      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "Ocean" },
      });

      expect(screen.getAllByTestId("booking-card")).toHaveLength(1);
      expect(screen.getByText("Ocean Breeze")).toBeInTheDocument();
    });
  });

  describe("Cancel Booking", () => {
    it("calls handleDeleteBooking with the correct booking id", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [makeBooking({ _id: "b1" })],
      });
      mockHandleDeleteBooking.mockResolvedValue({ success: true });

      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.click(screen.getByText("Cancel"));

      await waitFor(() =>
        expect(mockHandleDeleteBooking).toHaveBeenCalledWith("b1"),
      );
    });

    it("shows success toast and updates booking status to cancelled", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [makeBooking({ _id: "b1", status: "confirmed" })],
      });
      mockHandleDeleteBooking.mockResolvedValue({ success: true });

      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.click(screen.getByText("Cancel"));

      await waitFor(() =>
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Booking cancelled successfully",
        ),
      );
    });

    it("shows error toast when cancel fails", async () => {
      mockGetMyBookings.mockResolvedValue({
        success: true,
        data: [makeBooking({ _id: "b1" })],
      });
      mockHandleDeleteBooking.mockResolvedValue({
        success: false,
        message: "Cannot cancel",
      });

      render(<BookingHistoryPage />);
      await waitFor(() => screen.getAllByTestId("booking-card"));

      fireEvent.click(screen.getByText("Cancel"));

      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Cannot cancel"),
      );
    });
  });
});
