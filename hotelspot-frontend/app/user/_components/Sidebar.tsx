"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

//  SVG Icons

const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const DiscoverIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const InboxIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const BookingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="12" y1="14" x2="12" y2="14" />
    <line x1="16" y1="14" x2="16" y2="14" />
  </svg>
);

const ReviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Menu config

const menuItems = [
  { label: "Home", href: "/user/dashboard", icon: HomeIcon, badge: null },
  {
    label: "Discover",
    href: "/user/discover",
    icon: DiscoverIcon,
    badge: null,
  },
  { label: "Favourite", href: "/user/favourite", icon: HeartIcon, badge: null },
  { label: "Inbox", href: "/dashboard/inbox", icon: InboxIcon, badge: 0 },
  {
    label: "Booking History",
    href: "/user/booking/history",
    icon: BookingIcon,
    badge: null,
  },
  {
    label: "My Reviews",
    href: "/user/review/myreview",
    icon: ReviewIcon,
    badge: null,
  },
  { label: "Profile", href: "/user/profile", icon: ProfileIcon, badge: null },
];

// Sidebar

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initials = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <div
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Georgia', serif",
        flexShrink: 0,
      }}
    >
      {/* ── User card ── */}
      <div
        style={{
          padding: "2rem 1.5rem 1.5rem",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #2a2a2a",
            marginBottom: "1rem",
          }}
        >
          {user?.imageUrl ? (
            <img
              src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
              alt={user.username || "User"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0a",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name + role */}
        <p
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 0.2rem",
            letterSpacing: "0.02em",
          }}
        >
          {user?.fullName || user?.username || "Guest User"}
        </p>
        <p
          style={{
            color: "#c9a96e",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Traveler Enthusiast
        </p>
      </div>

      {/*  Nav  */}
      <nav style={{ flex: 1, padding: "1.5rem 1rem" }}>
        <p
          style={{
            color: "#3a3a3a",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 0.75rem 0.5rem",
          }}
        >
          Menu
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.75rem",
                  borderRadius: 2,
                  textDecoration: "none",
                  background: isActive ? "#161612" : "transparent",
                  borderLeft: isActive
                    ? "2px solid #c9a96e"
                    : "2px solid transparent",
                  color: isActive ? "#c9a96e" : "#6b7280",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.background = "#111";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#6b7280";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Icon />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Badge */}
                {typeof item.badge === "number" && (
                  <span
                    style={{
                      background: "#c9a96e",
                      color: "#0a0a0a",
                      fontSize: 9,
                      fontWeight: 700,
                      borderRadius: "999px",
                      minWidth: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 5px",
                      letterSpacing: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/*  Bottom  */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.75rem",
            background: "transparent",
            border: "none",
            color: "#6b7280",
            fontSize: 13,
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.03em",
            cursor: "pointer",
            borderRadius: 2,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#ef4444";
            (e.currentTarget as HTMLElement).style.background = "#1a0a0a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#6b7280";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogoutIcon />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
