import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleGetAllHotels } from "@/lib/actions/admin/hotel-action";
import Page from "@/app/admin/hotels/page";

jest.mock("@/lib/actions/admin/hotel-action", () => ({
  handleGetAllHotels: jest.fn(),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...p }: any) => (
    <a href={href} {...p}>
      {children}
    </a>
  ),
}));
jest.mock("@/app/admin/hotels/_components/HotelCard", () => ({
  __esModule: true,
  default: ({ hotels }: any) => (
    <div data-testid="hotel-cards">
      {hotels.map((h: any) => (
        <div key={h._id} data-testid="hotel-card">
          {h.hotelName}
        </div>
      ))}
    </div>
  ),
}));

const mockGetAllHotels = handleGetAllHotels as jest.Mock;

const makeHotel = (overrides = {}) => ({
  _id: "h1",
  hotelName: "Grand Palace",
  city: "Paris",
  country: "France",
  price: 300,
  ...overrides,
});

async function renderPage() {
  const Component = await Page();
  return render(Component as React.ReactElement);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
});

describe("Admin Hotels Page", () => {
  describe("Page Structure", () => {
    it("renders the Admin Panel label", async () => {
      await renderPage();
      expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });

    it("renders the Hotels heading", async () => {
      await renderPage();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Hotels",
      );
    });

    it("renders the Create Hotel link", async () => {
      await renderPage();
      expect(
        screen.getByRole("link", { name: /create hotel/i }),
      ).toHaveAttribute("href", "/admin/hotels/create");
    });
  });

  describe("Hotel Data", () => {
    it("passes hotels from API to HotelCards", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: true,
        data: [
          makeHotel({ _id: "h1", hotelName: "Grand Palace" }),
          makeHotel({ _id: "h2", hotelName: "Ocean Breeze" }),
        ],
      });
      await renderPage();
      expect(screen.getAllByTestId("hotel-card")).toHaveLength(2);
      expect(screen.getByText("Grand Palace")).toBeInTheDocument();
      expect(screen.getByText("Ocean Breeze")).toBeInTheDocument();
    });

    it("passes an empty array to HotelCards when API returns no data", async () => {
      mockGetAllHotels.mockResolvedValue({ success: true, data: [] });
      await renderPage();
      expect(screen.getByTestId("hotel-cards")).toBeInTheDocument();
      expect(screen.queryAllByTestId("hotel-card")).toHaveLength(0);
    });

    it("calls handleGetAllHotels with page 1 and limit 100", async () => {
      await renderPage();
      expect(mockGetAllHotels).toHaveBeenCalledWith("1", "100");
    });

    it("throws when API returns success: false", async () => {
      mockGetAllHotels.mockResolvedValue({
        success: false,
        message: "Server error",
      });
      await expect(Page()).rejects.toThrow("Server error");
    });

    it("throws with default message when API returns success: false and no message", async () => {
      mockGetAllHotels.mockResolvedValue({ success: false });
      await expect(Page()).rejects.toThrow("Failed to load hotels");
    });
  });
});
