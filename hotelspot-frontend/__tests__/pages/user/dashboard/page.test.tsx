import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleGetAllHotels } from "@/lib/actions/hotel-action";
import { handleGetMyFavourites } from "@/lib/actions/favourite-action";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import DashboardPage from "@/app/user/dashboard/page";

jest.mock("@/lib/actions/hotel-action", () => ({
  handleGetAllHotels: jest.fn(),
}));
jest.mock("@/lib/actions/favourite-action", () => ({
  handleGetMyFavourites: jest.fn(),
}));
jest.mock("@/app/context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));
jest.mock("@/app/user/_components/HotelCard", () => ({
  __esModule: true,
  default: ({ name }: any) => <div data-testid="hotel-card">{name}</div>,
}));
jest.mock("@/app/user/_components/PopularHotelCard", () => ({
  __esModule: true,
  default: ({ name }: any) => <div data-testid="popular-card">{name}</div>,
}));
jest.mock("@/app/user/_components/HotelDetailSidebar", () => ({
  __esModule: true,
  default: ({ hotel }: any) => <div data-testid="sidebar">{hotel.name}</div>,
}));

const mockGetAllHotels = handleGetAllHotels as jest.Mock;
const mockGetMyFavourites = handleGetMyFavourites as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockToastError = toast.error as jest.Mock;

const baseUser = { fullName: "John Doe", username: "johndoe" };

const makeHotel = (overrides = {}) => ({
  _id: "h1",
  hotelName: "Grand Palace",
  address: "1 Main St",
  city: "Paris",
  country: "France",
  price: 300,
  availableRooms: 5,
  rating: 4.8,
  imageUrl: "/img.jpg",
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ user: baseUser });
  mockGetMyFavourites.mockResolvedValue({ success: true, data: [] });
});

describe("DashboardPage", () => {
  describe("Loading State", () => {
    it("shows 3 skeleton loaders while hotels are being fetched", () => {
      mockGetAllHotels.mockReturnValue(new Promise(() => {}));
      render(<DashboardPage />);
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(3);
    });

    it("hides skeletons after hotels load", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [makeHotel()],
      });
      render(<DashboardPage />);
      await waitFor(() =>
        expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0),
      );
    });
  });

  describe("Header", () => {
    it("renders welcome back label", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
    });

    it("renders the user's full name", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("falls back to username when fullName is not set", async () => {
      mockUseAuth.mockReturnValue({ user: { username: "johndoe" } });
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("shows 'No results' when API returns empty array", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      await waitFor(() =>
        expect(screen.getByText(/No results/i)).toBeInTheDocument(),
      );
    });

    it("shows 'Try adjusting your search' hint when search has a value and no results", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText(/Search hotels/i), {
        target: { value: "xyz" },
      });
      await waitFor(() =>
        expect(
          screen.getByText(/Try adjusting your search/i),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("Hotel Rendering", () => {
    it("renders popular hotel cards from API response", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [
          makeHotel({ _id: "h1", hotelName: "Grand Palace", rating: 3 }),
          makeHotel({ _id: "h2", hotelName: "Ocean Breeze", rating: 3 }),
        ],
      });
      render(<DashboardPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("popular-card")).toHaveLength(2),
      );
    });

    it("renders featured hotel cards only for hotels rated 4.5 and above", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [
          makeHotel({ _id: "h1", hotelName: "Top Hotel", rating: 4.8 }),
          makeHotel({ _id: "h2", hotelName: "Low Hotel", rating: 3.0 }),
        ],
      });
      render(<DashboardPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
      expect(screen.getAllByText("Top Hotel").length).toBeGreaterThan(0);
    });

    it("does not render the featured section when no hotels have rating >= 4.5", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [makeHotel({ rating: 3.0 })],
      });
      render(<DashboardPage />);
      await waitFor(() => screen.getAllByTestId("popular-card"));
      expect(screen.queryByText("Featured Hotels")).not.toBeInTheDocument();
    });

    it("shows the sidebar with the first hotel on load", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [makeHotel({ hotelName: "Grand Palace" })],
      });
      render(<DashboardPage />);
      await waitFor(() =>
        expect(screen.getByTestId("sidebar")).toHaveTextContent("Grand Palace"),
      );
    });
  });

  describe("Error Handling", () => {
    it("shows error toast when API returns success: false", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: false,
        message: "Server error",
      });
      render(<DashboardPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Server error"),
      );
    });

    it("shows default error toast when API throws", async () => {
      mockGetAllHotels.mockRejectedValue(new Error("Network error"));
      render(<DashboardPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Network error"),
      );
    });
  });

  describe("Filter Tabs", () => {
    it("renders all three filter tabs", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [makeHotel()],
      });
      render(<DashboardPage />);
      await waitFor(() => screen.getAllByTestId("popular-card"));
      expect(screen.getByText("Recommended")).toBeInTheDocument();
      expect(screen.getByText("Popular")).toBeInTheDocument();
      expect(screen.getByText("Nearest")).toBeInTheDocument();
    });

    it("switches active filter when a tab is clicked", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [makeHotel()],
      });
      render(<DashboardPage />);
      await waitFor(() => screen.getAllByTestId("popular-card"));
      fireEvent.click(screen.getByText("Popular"));
      expect(screen.getByText("Popular")).toHaveClass("text-[#c9a96e]");
    });
  });

  describe("Search", () => {
    it("renders the search input", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      expect(
        screen.getByPlaceholderText(/Search hotels by name or location/i),
      ).toBeInTheDocument();
    });

    it("calls handleGetAllHotels with search query after debounce", async () => {
      jest.useFakeTimers();
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);

      fireEvent.change(screen.getByPlaceholderText(/Search hotels/i), {
        target: { value: "Paris" },
      });

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() =>
        expect(mockGetAllHotels).toHaveBeenCalledWith("1", "50", "Paris"),
      );

      jest.useRealTimers();
    });
  });

  describe("Favourites", () => {
    it("fetches favourites when user is logged in", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      await waitFor(() => expect(mockGetMyFavourites).toHaveBeenCalledTimes(1));
    });

    it("does not fetch favourites when user is not logged in", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      render(<DashboardPage />);
      await waitFor(() => screen.getByText(/No results/i));
      expect(mockGetMyFavourites).not.toHaveBeenCalled();
    });
  });
});
