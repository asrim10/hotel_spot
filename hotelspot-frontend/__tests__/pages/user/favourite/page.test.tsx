import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleGetMyFavourites } from "@/lib/actions/favourite-action";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import FavoritesPage from "@/app/user/favourite/page";

const mockUseAuth = useAuth as jest.Mock;
const mockGetFavourites = handleGetMyFavourites as jest.Mock;
const mockToastError = toast.error as jest.Mock;

jest.mock("@/lib/actions/favourite-action", () => ({
  handleGetMyFavourites: jest.fn(),
}));

jest.mock("@/app/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, initial, animate, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}));

jest.mock("@/app/user/favourite/_components/FavouriteSearch", () => ({
  FavoritesSearchBar: ({ value, onChange, count }: any) => (
    <div>
      <input
        data-testid="search-bar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search favorites..."
      />
      <span data-testid="fav-count">{count}</span>
    </div>
  ),
}));

jest.mock("@/app/user/favourite/_components/FavouriteGrid", () => ({
  FavoriteGridCard: ({ hotel, hotelId, onFavoriteChange }: any) => (
    <div data-testid="grid-card" data-hotel-id={hotelId}>
      <span>{hotel.hotelName}</span>
      <button onClick={() => onFavoriteChange(hotelId, false)}>Remove</button>
    </div>
  ),
}));

jest.mock("@/app/user/favourite/_components/FavouriteList", () => ({
  FavoriteListCard: ({ hotel, hotelId, onRemove }: any) => (
    <div data-testid="list-card" data-hotel-id={hotelId}>
      <span>{hotel.hotelName}</span>
      <button onClick={() => onRemove(hotelId)}>Remove</button>
    </div>
  ),
}));

jest.mock("@/app/user/favourite/_components/FavouriteEmpty", () => ({
  FavoriteEmptyState: ({ isFiltered }: any) => (
    <div data-testid="empty-state">
      {isFiltered ? "No results found" : "No favorites yet"}
    </div>
  ),
}));

const sampleFavorites = [
  {
    _id: "fav1",
    hotelId: "hotel1",
    hotel: {
      hotelName: "Grand Palace",
      address: "1 Rue de Rivoli",
      city: "Paris",
      country: "France",
      rating: 4.8,
      imageUrl: "/img1.jpg",
      price: 300,
    },
  },
  {
    _id: "fav2",
    hotelId: "hotel2",
    hotel: {
      hotelName: "Ocean Breeze",
      address: "200 Ocean Dr",
      city: "Miami",
      country: "USA",
      rating: 3.5,
      imageUrl: "/img2.jpg",
      price: 150,
    },
  },
  {
    _id: "fav3",
    hotelId: "hotel3",
    hotel: null,
  },
];

describe("FavoritesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { id: "user1", name: "Test User" } });
  });

  describe("Auth Guard", () => {
    it("does not fetch favorites when user is not logged in", () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<FavoritesPage />);
      expect(mockGetFavourites).not.toHaveBeenCalled();
    });

    it("fetches favorites when user is present", async () => {
      mockGetFavourites.mockResolvedValue({ success: true, data: [] });
      render(<FavoritesPage />);
      await waitFor(() => expect(mockGetFavourites).toHaveBeenCalledTimes(1));
    });
  });

  describe("Loading State", () => {
    it("shows 4 skeleton loaders while fetching", () => {
      mockGetFavourites.mockReturnValue(new Promise(() => {}));
      render(<FavoritesPage />);
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(4);
    });

    it("hides skeletons after data loads", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("grid-card")).toHaveLength(2),
      );
      expect(document.querySelectorAll(".animate-pulse")).toHaveLength(0);
    });
  });

  describe("Data Fetching", () => {
    it("renders grid cards from successful response", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(screen.getAllByTestId("grid-card")).toHaveLength(2),
      );
    });

    it("skips favorites with null hotel", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));
      expect(screen.getAllByTestId("grid-card")).toHaveLength(2);
    });

    it("shows empty state when API returns empty array", async () => {
      mockGetFavourites.mockResolvedValue({ success: true, data: [] });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(screen.getByTestId("empty-state")).toBeInTheDocument(),
      );
    });

    it("shows empty state and calls toast when success is false", async () => {
      mockGetFavourites.mockResolvedValue({
        success: false,
        message: "Unauthorized",
      });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Unauthorized"),
      );
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("calls toast with default message when error has no message", async () => {
      mockGetFavourites.mockResolvedValue({ success: false });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Failed to load favorites"),
      );
    });

    it("shows empty state and calls toast when API throws", async () => {
      mockGetFavourites.mockRejectedValue(new Error("Network error"));
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith("Network error"),
      );
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("passes correct count to FavoritesSearchBar", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() =>
        expect(screen.getByTestId("fav-count")).toHaveTextContent("3"),
      );
    });
  });

  describe("Page Header", () => {
    it("renders the Favorites heading", () => {
      mockGetFavourites.mockResolvedValue({ success: true, data: [] });
      render(<FavoritesPage />);
      expect(screen.getByText("Favorites")).toBeInTheDocument();
    });

    it("renders the My Collection label", () => {
      mockGetFavourites.mockResolvedValue({ success: true, data: [] });
      render(<FavoritesPage />);
      expect(screen.getByText("My Collection")).toBeInTheDocument();
    });
  });

  describe("View Mode Toggle", () => {
    it("renders grid view by default", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));
      expect(screen.queryByTestId("list-card")).not.toBeInTheDocument();
    });

    it("switches to list view when List button is clicked", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      const buttons = screen.getAllByRole("button");
      const listBtn = buttons.find((b) => b.querySelector("svg"));
      fireEvent.click(buttons[1]);

      await waitFor(() =>
        expect(screen.getAllByTestId("list-card")).toHaveLength(2),
      );
      expect(screen.queryByTestId("grid-card")).not.toBeInTheDocument();
    });

    it("switches back to grid view when Grid button is clicked", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]);
      await waitFor(() => screen.getAllByTestId("list-card"));

      fireEvent.click(buttons[0]);
      await waitFor(() =>
        expect(screen.getAllByTestId("grid-card")).toHaveLength(2),
      );
    });
  });

  describe("Search", () => {
    beforeEach(() => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
    });

    it("filters by hotel name", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.change(screen.getByTestId("search-bar"), {
        target: { value: "Grand" },
      });

      expect(screen.getAllByTestId("grid-card")).toHaveLength(1);
      expect(screen.getByText("Grand Palace")).toBeInTheDocument();
    });

    it("filters by city", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.change(screen.getByTestId("search-bar"), {
        target: { value: "miami" },
      });

      expect(screen.getAllByTestId("grid-card")).toHaveLength(1);
      expect(screen.getByText("Ocean Breeze")).toBeInTheDocument();
    });

    it("filters by country", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.change(screen.getByTestId("search-bar"), {
        target: { value: "france" },
      });

      expect(screen.getAllByTestId("grid-card")).toHaveLength(1);
    });

    it("filters by address", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.change(screen.getByTestId("search-bar"), {
        target: { value: "Ocean Dr" },
      });

      expect(screen.getAllByTestId("grid-card")).toHaveLength(1);
    });

    it("shows all results when search is cleared", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      const input = screen.getByTestId("search-bar");
      fireEvent.change(input, { target: { value: "Grand" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(screen.getAllByTestId("grid-card")).toHaveLength(2);
    });

    it("shows empty state with isFiltered=true when no results match", async () => {
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.change(screen.getByTestId("search-bar"), {
        target: { value: "xyznonexistent" },
      });

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "No results found",
      );
    });

    it("shows empty state with isFiltered=false when no favorites exist", async () => {
      mockGetFavourites.mockResolvedValue({ success: true, data: [] });
      render(<FavoritesPage />);
      await waitFor(() => screen.getByTestId("empty-state"));

      expect(screen.getByTestId("empty-state")).toHaveTextContent(
        "No favorites yet",
      );
    });
  });

  describe("Remove Favorite", () => {
    it("removes a favorite from grid view when unfavorited", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.click(screen.getAllByText("Remove")[0]);

      expect(screen.getAllByTestId("grid-card")).toHaveLength(1);
    });

    it("removes the correct hotel by hotelId", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.click(screen.getAllByText("Remove")[0]);

      expect(screen.queryByText("Grand Palace")).not.toBeInTheDocument();
      expect(screen.getByText("Ocean Breeze")).toBeInTheDocument();
    });

    it("removes a favorite from list view when onRemove is called", async () => {
      mockGetFavourites.mockResolvedValue({
        success: true,
        data: sampleFavorites,
      });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]);
      await waitFor(() => screen.getAllByTestId("list-card"));

      fireEvent.click(screen.getAllByText("Remove")[0]);

      expect(screen.getAllByTestId("list-card")).toHaveLength(1);
    });

    it("shows empty state after all favorites are removed", async () => {
      const single = [sampleFavorites[0]];
      mockGetFavourites.mockResolvedValue({ success: true, data: single });
      render(<FavoritesPage />);
      await waitFor(() => screen.getAllByTestId("grid-card"));

      fireEvent.click(screen.getByText("Remove"));

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
  });
});
