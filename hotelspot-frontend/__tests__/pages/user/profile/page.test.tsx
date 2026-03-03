import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import ProfilePage from "@/app/user/profile/page";

jest.mock("@/lib/actions/auth-action", () => ({
  handleWhoAmI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockHandleWhoAmI = handleWhoAmI as jest.Mock;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

const baseUser = {
  username: "johndoe",
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin",
  createdAt: "2023-01-15T00:00:00.000Z",
  updatedAt: "2024-06-20T00:00:00.000Z",
  imageUrl: null,
};

const userWithImage = {
  ...baseUser,
  imageUrl: "/uploads/avatar.jpg",
};

const userWithoutFullName = {
  ...baseUser,
  fullName: null,
};

async function renderProfilePage() {
  const Component = await ProfilePage();
  return render(Component as React.ReactElement);
}

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
  });

  describe("Error Handling", () => {
    it("throws an error when handleWhoAmI returns success: false", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: false });
      await expect(renderProfilePage()).rejects.toThrow(
        "Error fetching user data",
      );
    });

    it("calls notFound when handleWhoAmI returns no data", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: null });
      await expect(renderProfilePage()).rejects.toThrow("NEXT_NOT_FOUND");
      expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("Page Header", () => {
    it("renders the 'Your Profile' label", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getByText("Your Profile")).toBeInTheDocument();
    });

    it("renders 'Account Type' label", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getAllByText("Account Type")).toHaveLength(2);
    });

    it("renders the user role", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getAllByText(/admin/i).length).toBeGreaterThan(0);
    });

    it("renders 'Member since' with formatted createdAt date", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getByText(/Member since/i)).toBeInTheDocument();
      expect(screen.getAllByText(/January 15, 2023/i).length).toBeGreaterThan(
        0,
      );
    });
  });

  describe("Avatar", () => {
    it("renders an <img> when imageUrl is present", async () => {
      mockHandleWhoAmI.mockResolvedValue({
        success: true,
        data: userWithImage,
      });
      await renderProfilePage();
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        `https://api.example.com${userWithImage.imageUrl}`,
      );
      expect(img).toHaveAttribute("alt", userWithImage.username);
    });

    it("renders initials fallback when imageUrl is null", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("renders correct initial for a different username", async () => {
      const user = { ...baseUser, username: "alice", imageUrl: null };
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: user });
      await renderProfilePage();
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  describe("Name Display", () => {
    it("renders fullName in the hero heading when set", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "John Doe",
      );
    });

    it("falls back to username in the heading when fullName is null", async () => {
      mockHandleWhoAmI.mockResolvedValue({
        success: true,
        data: userWithoutFullName,
      });
      await renderProfilePage();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "johndoe",
      );
    });
  });

  describe("Stats Row", () => {
    it("renders the username stat", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getAllByText("johndoe").length).toBeGreaterThan(0);
    });

    it("renders the email stat", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getAllByText("john@example.com").length).toBeGreaterThan(0);
    });

    it("renders formatted updatedAt as a stat", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      expect(screen.getAllByText(/June 20, 2024/i).length).toBeGreaterThan(0);
    });
  });

  describe("Edit Profile Links", () => {
    it("renders two Edit Profile links pointing to /user/profile/edit", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
      const links = screen.getAllByRole("link", { name: /edit profile/i });
      expect(links).toHaveLength(2);
      links.forEach((link) =>
        expect(link).toHaveAttribute("href", "/user/profile/edit"),
      );
    });
  });

  describe("Account Details Section", () => {
    beforeEach(async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      await renderProfilePage();
    });

    it("renders the 'Account Details' label", () => {
      expect(screen.getByText("Account Details")).toBeInTheDocument();
    });

    it("renders the 'Personal Info' heading", () => {
      expect(
        screen.getByRole("heading", { level: 2, name: /personal info/i }),
      ).toBeInTheDocument();
    });

    it("renders the Full Name row with correct value", () => {
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
    });

    it("renders 'Not set' for Full Name when fullName is null", async () => {
      mockHandleWhoAmI.mockResolvedValue({
        success: true,
        data: userWithoutFullName,
      });
      await renderProfilePage();
      expect(screen.getByText("Not set")).toBeInTheDocument();
    });

    it("renders the Username row", () => {
      expect(screen.getAllByText("Username").length).toBeGreaterThan(0);
    });

    it("renders the Email Address row with correct value", () => {
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getAllByText("john@example.com").length).toBeGreaterThan(0);
    });

    it("renders the Account Type row with capitalised role", () => {
      expect(screen.getAllByText("Account Type").length).toBeGreaterThan(0);
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("renders the Account Created row with formatted date", () => {
      expect(screen.getByText("Account Created")).toBeInTheDocument();
      expect(screen.getAllByText(/January 15, 2023/i).length).toBeGreaterThan(
        0,
      );
    });

    it("renders the Last Updated row with formatted date", () => {
      expect(screen.getAllByText("Last Updated").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/June 20, 2024/i).length).toBeGreaterThan(0);
    });
  });

  describe("Date Formatting", () => {
    it("formats dates in 'Month Day, Year' format", async () => {
      const user = {
        ...baseUser,
        createdAt: "2020-03-05T00:00:00.000Z",
        updatedAt: "2021-11-30T00:00:00.000Z",
      };
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: user });
      await renderProfilePage();
      expect(screen.getAllByText(/March 5, 2020/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/November 30, 2021/i).length).toBeGreaterThan(
        0,
      );
    });
  });

  describe("Role Capitalisation", () => {
    it("capitalises a lowercase role for Account Type row", async () => {
      const user = { ...baseUser, role: "guest" };
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: user });
      await renderProfilePage();
      expect(screen.getByText("Guest")).toBeInTheDocument();
    });

    it("handles a single-character role", async () => {
      const user = { ...baseUser, role: "s" };
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: user });
      await renderProfilePage();
      expect(screen.getByText("S")).toBeInTheDocument();
    });
  });

  describe("Font Import", () => {
    it("injects a <style> tag with the Google Fonts import", async () => {
      mockHandleWhoAmI.mockResolvedValue({ success: true, data: baseUser });
      const { container } = await renderProfilePage();
      const style = container.querySelector("style");
      expect(style).toBeInTheDocument();
      expect(style?.textContent).toContain("fonts.googleapis.com");
    });
  });
});
