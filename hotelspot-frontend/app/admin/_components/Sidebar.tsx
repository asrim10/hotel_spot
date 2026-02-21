"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const HotelsIcon = () => (
  <svg
    width="15"
    height="15"
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

const BookingsIcon = () => (
  <svg
    width="15"
    height="15"
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
  </svg>
);

// ─── Config ───────────────────────────────────────────────────────────────────

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/hotels", label: "Hotels", icon: HotelsIcon },
  { href: "/admin/bookings", label: "Bookings", icon: BookingsIcon },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      {/* Rethink Sans font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap');
        .admin-sidebar * { font-family: 'Rethink Sans', sans-serif; }
      `}</style>

      <aside
        className="admin-sidebar"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: 240,
          background: "#0a0a0a",
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        {/* ── Logo ── */}
        <div
          style={{
            padding: "1.75rem 1.5rem",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
          }}
        >
          {/* Monogram */}
          <div
            style={{
              width: 34,
              height: 34,
              background: "#c9a96e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0a0a",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div>
            <p
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "0.04em",
              }}
            >
              Admin Panel
            </p>
            <p
              style={{
                color: "#c9a96e",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Control Center
            </p>
          </div>
        </div>

        {/* ── Nav ── */}
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
            Navigation
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ADMIN_LINKS.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.65rem 0.75rem",
                    borderRadius: 2,
                    textDecoration: "none",
                    background: active ? "#161612" : "transparent",
                    borderLeft: active
                      ? "2px solid #c9a96e"
                      : "2px solid transparent",
                    color: active ? "#c9a96e" : "#6b7280",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    letterSpacing: "0.02em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.background =
                        "#111";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = "#6b7280";
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  <Icon />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <p
            style={{
              color: "#2a2a2a",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Admin v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
