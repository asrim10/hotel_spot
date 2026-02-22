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
const ReviewsIcon = () => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/hotels", label: "Hotels", icon: HotelsIcon },
  { href: "/admin/bookings", label: "Bookings", icon: BookingsIcon },
  { href: "/admin/review", label: "Reviews", icon: ReviewsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside className="sticky top-0 h-screen w-60 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col shrink-0 overflow-y-auto">
      <div className="px-6 py-7 border-b border-[#1a1a1a] flex items-center gap-3.5">
        <div className="w-8.5 h-8.5 bg-[#c9a96e] flex items-center justify-center text-[#0a0a0a] text-sm font-extrabold tracking-wide shrink-0">
          A
        </div>
        <div>
          <p className="text-white text-[13px] font-bold tracking-[0.04em] m-0">
            Admin Panel
          </p>
          <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase m-0">
            Control Center
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase mb-3 ml-2">
          Navigation
        </p>
        <div className="flex flex-col gap-0.5">
          {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] tracking-[0.02em] transition-all border-l-2 no-underline ${
                  active
                    ? "bg-[#161612] border-[#c9a96e] text-[#c9a96e] font-semibold"
                    : "border-transparent text-[#6b7280] font-normal hover:bg-[#111] hover:text-white"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-6 py-5 border-t border-[#1a1a1a]">
        <p className="text-[#2a2a2a] text-[10px] tracking-[0.12em] uppercase m-0">
          Admin v1.0
        </p>
      </div>
    </aside>
  );
}
