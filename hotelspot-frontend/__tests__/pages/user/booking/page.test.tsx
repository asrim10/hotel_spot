import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getHotelById } from "@/lib/api/hotel";
import { createBooking } from "@/lib/api/booking";
import { getReviewsByHotel } from "@/lib/api/review";
import { handleInitiateKhaltiPayment } from "@/lib/actions/payment-action";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import HotelBookingPage from "@/app/user/booking/page";

jest.mock("@/lib/api/hotel", () => ({ getHotelById: jest.fn() }));
jest.mock("@/lib/api/booking", () => ({ createBooking: jest.fn() }));
jest.mock("@/lib/api/review", () => ({ getReviewsByHotel: jest.fn() }));
jest.mock("@/lib/actions/payment-action", () => ({
  handleInitiateKhaltiPayment: jest.fn(),
}));
jest.mock("@/app/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (k: string) => (k === "hotelId" ? "hotel123" : null),
  }),
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock("next/dynamic", () => () => () => <div data-testid="hotel-map" />);

const mockGetHotelById = getHotelById as jest.Mock;
const mockCreateBooking = createBooking as jest.Mock;
const mockGetReviewsByHotel = getReviewsByHotel as jest.Mock;
const mockHandleKhalti = handleInitiateKhaltiPayment as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

const baseHotel = {
  _id: "hotel123",
  hotelName: "Grand Palace",
  address: "1 Rue de Rivoli",
  city: "Paris",
  country: "France",
  price: 500,
  description: "A lovely hotel in Paris.",
  amenities: ["Pool", "WiFi", "Gym"],
  imageUrl: "/img.jpg",
  coordinates: { lat: 48.8566, lng: 2.3522 },
};

const baseReviews = [
  {
    _id: "r1",
    userId: { fullName: "Alice" },
    rating: 5,
    comment: "Amazing stay!",
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  {
    _id: "r2",
    userId: { fullName: "Bob" },
    rating: 3,
    comment: "It was okay.",
    createdAt: "2024-02-15T00:00:00.000Z",
  },
];

const baseUser = { fullName: "John Doe", email: "john@example.com" };

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ user: baseUser });
  mockGetHotelById.mockResolvedValue({ success: true, data: baseHotel });
  mockGetReviewsByHotel.mockResolvedValue({ success: true, data: baseReviews });
  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
});

describe("HotelBookingPage", () => {
  describe("Loading State", () => {
    it("shows skeleton loaders while hotel is being fetched", () => {
      mockGetHotelById.mockReturnValue(new Promise(() => {}));
      render(<HotelBookingPage />);
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(3);
    });

    it("hides skeletons and shows hotel content after loading", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText("Grand Palace")).toBeInTheDocument(),
      );
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
    });
  });

  describe("Hotel Not Found", () => {
    it("shows not found message when hotel fetch returns null", async () => {
      mockGetHotelById.mockResolvedValue(null);
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText("Hotel not found.")).toBeInTheDocument(),
      );
    });

    it("shows not found when fetch throws", async () => {
      mockGetHotelById.mockRejectedValue(new Error("Network error"));
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText("Hotel not found.")).toBeInTheDocument(),
      );
    });
  });

  describe("Hotel Details", () => {
    it("renders hotel name", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText("Grand Palace")).toBeInTheDocument(),
      );
    });

    it("renders hotel location", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(
          screen.getAllByText(/1 Rue de Rivoli, Paris, France/).length,
        ).toBeGreaterThan(0),
      );
    });

    it("renders hotel price per night", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => expect(screen.getByText(/500/)).toBeInTheDocument());
    });

    it("renders hotel description", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(
          screen.getByText("A lovely hotel in Paris."),
        ).toBeInTheDocument(),
      );
    });

    it("renders amenities", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByText("Pool")).toBeInTheDocument();
      expect(screen.getByText("WiFi")).toBeInTheDocument();
      expect(screen.getByText("Gym")).toBeInTheDocument();
    });

    it("renders the map when coordinates are present", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByTestId("hotel-map")).toBeInTheDocument(),
      );
    });

    it("shows 'Location unavailable' when coordinates are missing", async () => {
      mockGetHotelById.mockResolvedValue({
        success: true,
        data: { ...baseHotel, coordinates: null },
      });
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText(/Location unavailable/i)).toBeInTheDocument(),
      );
    });
  });

  describe("Reviews", () => {
    it("renders reviews from API", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByText("Amazing stay!")).toBeInTheDocument();
      expect(screen.getByText("It was okay.")).toBeInTheDocument();
    });

    it("shows average rating when reviews exist", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByText("4.0")).toBeInTheDocument();
    });

    it("shows review count", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getAllByText(/2 reviews/).length).toBeGreaterThan(0);
    });

    it("shows 'No reviews yet' when there are no reviews", async () => {
      mockGetReviewsByHotel.mockResolvedValue({ success: true, data: [] });
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument(),
      );
    });

    it("shows 'Show all reviews' button when reviews exist", async () => {
      render(<HotelBookingPage />);
      await waitFor(() =>
        expect(screen.getByText(/Show all 2 reviews/i)).toBeInTheDocument(),
      );
    });

    it("navigates to reviews page when 'Show all' is clicked", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText(/Show all 2 reviews/i));
      fireEvent.click(screen.getByText(/Show all 2 reviews/i));
      expect(mockPush).toHaveBeenCalledWith("/user/review?hotelId=hotel123");
    });
  });

  describe("Booking Form - Pre-fill", () => {
    it("pre-fills full name from logged in user", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByPlaceholderText("Your full name")).toHaveValue(
        "John Doe",
      );
    });

    it("pre-fills email from logged in user", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByPlaceholderText("your@email.com")).toHaveValue(
        "john@example.com",
      );
    });

    it("leaves fields empty when no user is logged in", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.getByPlaceholderText("Your full name")).toHaveValue("");
      expect(screen.getByPlaceholderText("your@email.com")).toHaveValue("");
    });
  });

  describe("Booking Form - Validation", () => {
    it("Pay at Hotel button is disabled when no dates are selected", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      const cashBtn = screen.getByText(/Pay at Hotel/i).closest("button");
      expect(cashBtn).toBeDisabled();
    });

    it("Pay with Khalti button is disabled when no dates are selected", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      const khaltiBtn = screen.getByText(/Pay with Khalti/i).closest("button");
      expect(khaltiBtn).toBeDisabled();
    });

    it("shows error when booking without name and email after dates are set", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay at Hotel/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay at Hotel/i));
      await waitFor(() => expect(mockToastError).toHaveBeenCalled());
    });
  });

  describe("Navigation", () => {
    it("calls router.back() when Back button is clicked", async () => {
      render(<HotelBookingPage />);
      fireEvent.click(screen.getByText(/Back/i));
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe("Cash Booking", () => {
    it("calls createBooking with cash payment method", async () => {
      mockCreateBooking.mockResolvedValue({
        success: true,
        data: { _id: "booking1" },
      });
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay at Hotel/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay at Hotel/i));

      await waitFor(() =>
        expect(mockCreateBooking).toHaveBeenCalledWith(
          expect.objectContaining({ paymentMethod: "cash" }),
        ),
      );
    });

    it("shows success toast and redirects after cash booking", async () => {
      mockCreateBooking.mockResolvedValue({
        success: true,
        data: { _id: "booking1" },
      });
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay at Hotel/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay at Hotel/i));

      await waitFor(() =>
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Booking created successfully",
        ),
      );
      expect(mockPush).toHaveBeenCalledWith("/user/booking/history");
    });

    it("shows error toast when createBooking returns success: false", async () => {
      mockCreateBooking.mockResolvedValue({
        success: false,
        message: "Room unavailable",
      });
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay at Hotel/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay at Hotel/i));

      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Room unavailable"),
      );
    });
  });

  describe("Online (Khalti) Booking", () => {
    it("calls Khalti payment initiation with correct booking details", async () => {
      mockCreateBooking.mockResolvedValue({
        success: true,
        data: { _id: "booking1" },
      });
      mockHandleKhalti.mockResolvedValue({
        success: true,
        data: { payment_url: "https://khalti.com/pay/abc" },
      });

      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay with Khalti/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay with Khalti/i));

      await waitFor(() =>
        expect(mockHandleKhalti).toHaveBeenCalledWith(
          expect.objectContaining({
            bookingId: "booking1",
            totalPrice: expect.any(Number),
            fullName: "John Doe",
            email: "john@example.com",
          }),
        ),
      );
    });

    it("shows error when Khalti initiation fails", async () => {
      mockCreateBooking.mockResolvedValue({
        success: true,
        data: { _id: "booking1" },
      });
      mockHandleKhalti.mockResolvedValue({
        success: false,
        message: "Khalti error",
      });

      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-05" } });

      await waitFor(() =>
        expect(
          screen.getByText(/Pay with Khalti/i).closest("button"),
        ).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByText(/Pay with Khalti/i));

      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Khalti error"),
      );
    });
  });

  describe("Price Calculation", () => {
    it("shows price breakdown after selecting dates", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));

      const dateInputs = document.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2099-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2099-06-04" } });

      await waitFor(() => expect(screen.getByText(/× 3/)).toBeInTheDocument());
      expect(screen.getByText(/Taxes & fees/i)).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });

    it("does not show price breakdown before dates are selected", async () => {
      render(<HotelBookingPage />);
      await waitFor(() => screen.getByText("Grand Palace"));
      expect(screen.queryByText("Total")).not.toBeInTheDocument();
    });
  });
});
