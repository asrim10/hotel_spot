"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Heart,
  Inbox,
  CalendarDays,
  Star,
  User,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Home", href: "/user/dashboard", icon: Home },
  { label: "Discover", href: "/user/hotels", icon: Compass },
  { label: "Favourite", href: "/user/favourite", icon: Heart },
  { label: "Inbox", href: "/dashboard/inbox", icon: Inbox, badge: 0 },
  {
    label: "Booking History",
    href: "/user/booking/history",
    icon: CalendarDays,
  },
  { label: "My Reviews", href: "/user/review/myreview", icon: Star },
  { label: "Profile", href: "/user/profile", icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const initials = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className="w-60 min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col flex-shrink-0"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* USER CARD */}
      <div className="px-6 pt-8 pb-6 border-b border-[#1a1a1a]">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2a2a2a] mb-4">
          {user?.imageUrl ? (
            <img
              src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
              alt={user.username || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[#0a0a0a] text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
              }}
            >
              {initials}
            </div>
          )}
        </div>
        <p className="text-white text-[15px] font-bold m-0 mb-0.5 tracking-[0.02em]">
          {user?.fullName || user?.username || "Guest User"}
        </p>
        <p className="text-[#c9a96e] text-[10px] tracking-[0.18em] uppercase m-0">
          Traveler Enthusiast
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase ml-2 mb-3">
          Menu
        </p>
        <div className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 no-underline transition-colors border-l-2 ${
                  isActive
                    ? "bg-[#161612] border-[#c9a96e] text-[#c9a96e]"
                    : "border-transparent text-[#6b7280] hover:bg-[#111] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} strokeWidth={1.8} />
                  <span
                    className={`text-[13px] tracking-[0.03em] ${isActive ? "font-semibold" : "font-normal"}`}
                  >
                    {item.label}
                  </span>
                </div>
                {"badge" in item && typeof item.badge === "number" && (
                  <span className="bg-[#c9a96e] text-[#0a0a0a] text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[#6b7280] text-[13px] tracking-[0.03em] bg-transparent border-none cursor-pointer transition-colors hover:text-[#f87171] hover:bg-[#1a0a0a]"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          <LogOut size={15} strokeWidth={1.8} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
