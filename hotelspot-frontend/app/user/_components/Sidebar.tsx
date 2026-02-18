"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/user/dashboard", badge: null },
    { label: "Discover", href: "/user/discover", badge: null },
    { label: "Favourite", href: "/user/favourite", badge: null },
    { label: "Inbox", href: "/dashboard/inbox", badge: 0 },
    { label: "Booking History", href: "/user/booking/history" },

    { label: "Profile", href: "/user/profile", badge: null },
  ];

  return (
    <div className="w-64 bg-gray-700 min-h-screen p-6 flex flex-col">
      {/* User Profile */}
      <div className="bg-gray-200 rounded-2xl p-6 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-emerald-100">
            {user?.imageUrl ? (
              <img
                src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                alt={user.username || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg text-gray-800">
            {user?.fullName || user?.username || "Guest User"}
          </h3>
          <p className="text-sm text-gray-500">Traveler Enthusiast</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              pathname === item.href
                ? "bg-white text-emerald-600 shadow-md"
                : "text-white hover:bg-white/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-orange-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 mt-8">
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all"
        ></Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all"
        >
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
