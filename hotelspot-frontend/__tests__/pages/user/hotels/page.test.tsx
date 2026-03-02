import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HotelsPage from "@/app/user/hotels/page";
import { getAllHotels } from "@/lib/api/hotel";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/api/hotel", () => ({
  getAllHotels: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock("@/app/user/hotels/_components/HotelCard", () => ({
  __esModule: true,
  default: ({ hotel, onBook }: any) => (
    <div data-testid="hotel-card" data-hotel-id={hotel._id || hotel.id}>
      <span>{hotel.hotelName || hotel.name}</span>
      <button onClick={onBook}>Book</button>
    </div>
  ),
}));

jest.mock("@/app/user/hotels/_components/HotelFilters", () => ({
  __esModule: true,
  default: ({ onChange, onClose }: any) => (
    <div data-testid="hotel-filters">
      <button
        onClick={() =>
          onChange({
            minPrice: "100",
            maxPrice: "500",
            rating: "4",
            amenities: ["wifi"],
            sortBy: "price_asc",
          })
        }
      >
        Apply Filters
      </button>
      <button onClick={onClose}>Close Filters</button>
    </div>
  ),
}));

jest.mock("@/app/user/hotels/_components/HotelsHero", () => ({
  __esModule: true,
  default: ({ total }: any) => (
    <div data-testid="hotels-hero">Total: {total}</div>
  ),
}));

const mockGetAllHotels = getAllHotels as jest.Mock;

const sampleHotels = [
  {
    _id: "1",
    hotelName: "Grand Palace",
    city: "Paris",
    country: "France",
    address: "1 Rue de Rivoli",
    price: 300,
    rating: 4.8,
    amenities: ["wifi", "pool"],
  },
  {
    _id: "2",
    hotelName: "Ocean Breeze",
    city: "Miami",
    country: "USA",
    address: "200 Ocean Dr",
    price: 150,
    rating: 3.5,
    amenities: ["wifi", "gym"],
  },
  {
    _id: "3",
    name: "Mountain Lodge",
    city: "Denver",
    country: "USA",
    address: "5 Alpine Rd",
    price: 80,
    rating: 4.2,
    amenities: ["gym"],
  },
];

describe("HotelsPage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("Loading State", () => {
    it("shows 6 skeleton loaders while fetching", () => {
      mockGetAllHotels.mockReturnValue(new Promise(() => {}));
      render(<HotelsPage />);
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(6);
    });

    it("hides skeletons and shows cards after data loads", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("hotel-card")).toHaveLength(3),
      );
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
    });
  });

  describe("Data Fetching", () => {
    it("renders hotels from { success, data } shape", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("hotel-card")).toHaveLength(3),
      );
    });

    it("renders hotels from plain array response", async () => {
      mockGetAllHotels.mockResolvedValue(sampleHotels);
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("hotel-card")).toHaveLength(3),
      );
    });

    it("shows empty state when API returns unexpected shape", async () => {
      mockGetAllHotels.mockResolvedValue({ success: false });
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getByText("No Hotels Found")).toBeInTheDocument(),
      );
    });

    it("shows empty state when API rejects", async () => {
      mockGetAllHotels.mockRejectedValue(new Error("Network error"));
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getByText("No Hotels Found")).toBeInTheDocument(),
      );
    });

    it("passes correct total to HotelsHero", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
      render(<HotelsPage />);
      await waitFor(() =>
        expect(screen.getByTestId("hotels-hero")).toHaveTextContent("Total: 3"),
      );
    });
  });

  describe("Search", () => {
    beforeEach(() => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
    });

    it("filters by hotelName", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "Grand" },
      });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
      expect(screen.getByText("Grand Palace")).toBeInTheDocument();
    });

    it("filters by name field (fallback)", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "Mountain" },
      });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
    });

    it("filters by city (case-insensitive)", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "miami" },
      });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
    });

    it("filters by country", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "france" },
      });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
    });

    it("filters by address", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "Alpine" },
      });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(1);
    });

    it("returns all hotels when search is cleared", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      const input = screen.getByPlaceholderText(/search by hotel name/i);
      fireEvent.change(input, { target: { value: "Grand" } });
      fireEvent.change(input, { target: { value: "" } });
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(3);
    });

    it("shows 'No Hotels Found' when no results match", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "xyznonexistent" },
      });
      expect(screen.getByText("No Hotels Found")).toBeInTheDocument();
    });

    it("clears input when X button is clicked", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      const input = screen.getByPlaceholderText(/search by hotel name/i);
      fireEvent.change(input, { target: { value: "Grand" } });
      const xBtn = input.closest("div")!.querySelector("button")!;
      fireEvent.click(xBtn);
      expect(input).toHaveValue("");
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(3);
    });
  });

  describe("Filters Panel", () => {
    beforeEach(() => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
    });

    it("is hidden by default", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      expect(screen.queryByTestId("hotel-filters")).not.toBeInTheDocument();
    });

    it("opens when Filters button is clicked", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText(/filters/i));
      expect(screen.getByTestId("hotel-filters")).toBeInTheDocument();
    });

    it("closes when Filters button is clicked again", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));

      const filtersBtn = screen.getByRole("button", { name: /^filters$/i });
      fireEvent.click(filtersBtn);
      fireEvent.click(filtersBtn);

      expect(screen.queryByTestId("hotel-filters")).not.toBeInTheDocument();
    });

    it("closes via onClose callback", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText(/filters/i));
      fireEvent.click(screen.getByText("Close Filters"));
      expect(screen.queryByTestId("hotel-filters")).not.toBeInTheDocument();
    });
  });

  describe("Filter Logic", () => {
    beforeEach(() => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
    });

    it("excludes hotels below minPrice", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText(/filters/i));
      fireEvent.click(screen.getByText("Apply Filters"));
      expect(screen.queryByText("Mountain Lodge")).not.toBeInTheDocument();
    });

    it("excludes hotels below minimum rating", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText(/filters/i));
      fireEvent.click(screen.getByText("Apply Filters"));
      expect(screen.queryByText("Ocean Breeze")).not.toBeInTheDocument();
    });

    it("excludes hotels missing required amenities", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText(/filters/i));
      fireEvent.click(screen.getByText("Apply Filters"));
      expect(screen.queryByText("Mountain Lodge")).not.toBeInTheDocument();
    });

    it("sorts remaining hotels by price ascending", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));

      fireEvent.click(screen.getByRole("button", { name: /^filters$/i }));
      fireEvent.click(screen.getByText("Apply Filters"));

      // After filters: minPrice=100 (excludes Lodge $80), rating=4 (excludes Ocean 3.5), amenities=wifi
      // Only Grand Palace remains
      const cards = screen.getAllByTestId("hotel-card");
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveAttribute("data-hotel-id", "1");
    });

    it("shows active filter count badge", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));

      fireEvent.click(screen.getByRole("button", { name: /^filters$/i }));
      fireEvent.click(screen.getByText("Apply Filters"));

      const badge = document.querySelector("button span.bg-\\[\\#c9a96e\\]");
      expect(badge).toBeInTheDocument();
      expect(badge?.textContent).toMatch(/[1-9]/);
    });
  });

  describe("Empty State", () => {
    beforeEach(() => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
    });

    it("renders all empty-state elements when no results found", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "zzznomatch" },
      });
      expect(screen.getByText("No Results")).toBeInTheDocument();
      expect(screen.getByText("No Hotels Found")).toBeInTheDocument();
      expect(screen.getByText(/try adjusting/i)).toBeInTheDocument();
      expect(screen.getByText(/clear all filters/i)).toBeInTheDocument();
    });

    it("restores full list when 'Clear All Filters' is clicked", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "zzznomatch" },
      });
      fireEvent.click(screen.getByText(/clear all filters/i));
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(3);
    });
  });

  describe("Hotel Count Display", () => {
    beforeEach(() => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
    });

    it("shows full count when unfiltered", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      expect(screen.getByText(/3 of 3 hotels/i)).toBeInTheDocument();
    });

    it("shows filtered count vs total when search is active", async () => {
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.change(screen.getByPlaceholderText(/search by hotel name/i), {
        target: { value: "Grand" },
      });
      expect(screen.getByText(/1 of 3 hotels/i)).toBeInTheDocument();
    });
  });

  describe("Booking Navigation", () => {
    it("navigates using hotel._id", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getAllByText("Book")[0]);
      expect(mockPush).toHaveBeenCalledWith("/user/booking?hotelId=1");
    });

    it("navigates using hotel.id as fallback", async () => {
      const hotelWithId = [
        {
          id: "abc123",
          name: "Test Hotel",
          city: "NYC",
          country: "USA",
          price: 200,
          rating: 4,
          amenities: [],
        },
      ];
      mockGetAllHotels.mockResolvedValue({ success: true, data: hotelWithId });
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getByText("Book"));
      expect(mockPush).toHaveBeenCalledWith("/user/booking?hotelId=abc123");
    });

    it("navigates to the correct hotel for the second card", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: sampleHotels });
      render(<HotelsPage />);
      await waitFor(() => screen.getAllByTestId("hotel-card"));
      fireEvent.click(screen.getAllByText("Book")[1]);
      expect(mockPush).toHaveBeenCalledWith("/user/booking?hotelId=2");
    });
  });
});
