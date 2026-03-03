import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleGetReviewsByHotel } from "@/lib/actions/review-action";
import { getHotelById } from "@/lib/api/hotel";
import { useAuth } from "@/app/context/AuthContext";
import HotelReviewsPage from "@/app/user/review/page";

jest.mock("@/lib/actions/review-action", () => ({
  handleGetReviewsByHotel: jest.fn(),
}));
jest.mock("@/lib/api/hotel", () => ({ getHotelById: jest.fn() }));
jest.mock("@/app/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/app/BookingUtils", () => ({
  getImageUrl: (url?: string) => url || "",
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (k: string) => (k === "hotelId" ? "hotel123" : null),
  }),
}));

jest.mock("@/app/user/review/_components/HotelReviewCard", () => ({
  HotelReviewCard: ({ review }: any) => (
    <div data-testid="review-card">{review.comment}</div>
  ),
}));
jest.mock("@/app/user/review/_components/ReviewModal", () => ({
  ReviewModal: ({ onClose }: any) => (
    <div data-testid="review-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
jest.mock("@/app/user/review/_components/Stars", () => ({
  Stars: ({ value }: any) => <div data-testid="stars">{value}</div>,
}));

const mockGetReviewsByHotel = handleGetReviewsByHotel as jest.Mock;
const mockGetHotelById = getHotelById as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;

const baseHotel = {
  _id: "hotel123",
  hotelName: "Grand Palace",
  address: "1 Main St",
  city: "Paris",
  country: "France",
  description: "A beautiful hotel.",
  price: 300,
  availableRooms: 5,
  imageUrl: "/img.jpg",
};

const baseReviews = [
  {
    _id: "r1",
    rating: 5,
    comment: "Amazing stay!",
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  {
    _id: "r2",
    rating: 3,
    comment: "It was okay.",
    createdAt: "2024-02-15T00:00:00.000Z",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ user: { id: "u1", fullName: "John" } });
  mockGetHotelById.mockResolvedValue({ success: true, data: baseHotel });
  mockGetReviewsByHotel.mockResolvedValue({ success: true, data: baseReviews });
});

describe("HotelReviewsPage", () => {
  describe("Loading State", () => {
    it("shows loading text while data is being fetched", () => {
      mockGetHotelById.mockReturnValue(new Promise(() => {}));
      mockGetReviewsByHotel.mockReturnValue(new Promise(() => {}));
      render(<HotelReviewsPage />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("hides loading text after data loads", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      );
    });
  });

  describe("Hotel Details", () => {
    it("renders the hotel name", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("Grand Palace")).toBeInTheDocument(),
      );
    });

    it("renders the hotel description", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("A beautiful hotel.")).toBeInTheDocument(),
      );
    });

    it("renders the price per night stat", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("Rs. 300")).toBeInTheDocument(),
      );
    });

    it("renders available rooms stat", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
    });

    it("shows 'Hotel Not Found' when hotel fetch returns no data", async () => {
      mockGetHotelById.mockResolvedValue(null);
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("Hotel Not Found")).toBeInTheDocument(),
      );
    });
  });

  describe("Reviews", () => {
    it("renders a review card for each review", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("review-card")).toHaveLength(2),
      );
    });

    it("shows average rating when reviews exist", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() => expect(screen.getByText("4.0")).toBeInTheDocument());
    });

    it("shows total review count", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText(/2 reviews/i)).toBeInTheDocument(),
      );
    });

    it("shows 'Be The First' placeholder when there are no reviews", async () => {
      mockGetReviewsByHotel.mockResolvedValue({ success: true, data: [] });
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("Be The First")).toBeInTheDocument(),
      );
    });
  });

  describe("Write a Review", () => {
    it("shows 'Write a Review' button when user is logged in", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.getByText("Write a Review")).toBeInTheDocument(),
      );
    });

    it("does not show 'Write a Review' button when user is not logged in", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<HotelReviewsPage />);
      await waitFor(() =>
        expect(screen.queryByText("Write a Review")).not.toBeInTheDocument(),
      );
    });

    it("opens the review modal when 'Write a Review' is clicked", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() => screen.getByText("Write a Review"));
      fireEvent.click(screen.getByText("Write a Review"));
      expect(screen.getByTestId("review-modal")).toBeInTheDocument();
    });

    it("closes the review modal when onClose is called", async () => {
      render(<HotelReviewsPage />);
      await waitFor(() => screen.getByText("Write a Review"));
      fireEvent.click(screen.getByText("Write a Review"));
      fireEvent.click(screen.getByText("Close"));
      expect(screen.queryByTestId("review-modal")).not.toBeInTheDocument();
    });
  });
});
