"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Download,
  ChevronRight,
  Search,
  Filter,
  Star,
  Phone,
} from "lucide-react";
import { getMyBookings, getBookingById } from "@/lib/api/booking";
import { getHotelById } from "@/lib/api/hotel";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function BookingHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hotelCache, setHotelCache] = useState<Record<string, any>>({});
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-800 text-green-100";
      case "upcoming":
        return "bg-blue-800 text-blue-100";
      case "cancelled":
        return "bg-red-800 text-red-100";
      default:
        return "bg-gray-700 text-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getImageUrl = (
    imageUrl?: string,
    fallback = "/api/placeholder/300/200",
  ) => {
    if (!imageUrl) return fallback;
    if (imageUrl.startsWith("http")) return imageUrl;
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + imageUrl;
  };

  const parseDate = (dateInput: any) => {
    if (!dateInput) return null;
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  const formatDate = (dateInput: any) => {
    const date = parseDate(dateInput);
    if (!date) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getHotelData = (booking: any) => {
    return booking.hotel || hotelCache[booking.hotelId] || {};
  };

  const getLocationString = (hotelData: any) => {
    const address = hotelData?.address || "";
    const city = hotelData?.city || "";
    const country = hotelData?.country || "";
    const parts = [address, city, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location";
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (activeTab !== "all") {
      filtered = filtered.filter((booking) => booking.status === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter((booking) => {
        const hotelData = getHotelData(booking);
        const hotelName = hotelData?.hotelName || booking.hotelName || "";
        const location = getLocationString(hotelData);
        const id = booking._id || booking.id || "";
        return (
          hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  };

  useEffect(() => {
    if (!user) return; // wait for auth

    setLoading(true);
    getMyBookings()
      .then((res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          setBookings(res.data);
        } else if (Array.isArray(res)) {
          setBookings(res);
        } else {
          setBookings([]);
        }
      })
      .catch((err: any) => {
        toast.error(err.message || "Failed to load bookings");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!bookings.length) return;

    // Fetch hotel details for bookings that don't have hotel populated
    bookings.forEach((booking) => {
      if (!booking.hotel && booking.hotelId && !hotelCache[booking.hotelId]) {
        getHotelById(booking.hotelId)
          .then((res: any) => {
            const hotelData = res?.success ? res.data : res;
            if (hotelData) {
              setHotelCache((prev) => ({
                ...prev,
                [booking.hotelId]: hotelData,
              }));
            }
          })
          .catch((err: any) => {
            console.error(`Failed to fetch hotel ${booking.hotelId}:`, err);
          });
      }
    });
  }, [bookings]);

  const filteredBookings = filterBookings();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Booking History</h1>
          <p className="text-gray-300 text-sm mt-1">
            View and manage all your hotel bookings
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by hotel name, location, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-700">
              <Filter className="w-5 h-5 text-gray-100" />
              <span className="font-medium text-gray-100">Filters</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "upcoming"
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "completed"
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "cancelled"
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-100">
              No bookings found
            </h3>
            <p className="text-gray-300">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Hotel Image */}
                  <div className="lg:w-80 h-48 lg:h-auto">
                    <img
                      src={
                        getHotelData(booking)?.imageUrl
                          ? getImageUrl(getHotelData(booking).imageUrl)
                          : booking.image || "/api/placeholder/300/200"
                      }
                      alt={
                        getHotelData(booking)?.hotelName || booking.hotelName
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-100">
                            {getHotelData(booking)?.hotelName ||
                              booking.hotelName ||
                              "Hotel"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-300 text-sm mb-1">
                          <MapPin className="w-4 h-4 mr-1 text-gray-300" />
                          {getLocationString(getHotelData(booking))}
                        </div>
                        <div className="text-sm text-gray-400">
                          Booking ID: {booking._id || booking.id} •
                          Confirmation:{" "}
                          {booking.confirmation ||
                            booking.confirmationCode ||
                            "-"}
                        </div>
                      </div>
                      {booking.rating && (
                        <div className="flex items-center gap-1 bg-yellow-700 px-3 py-1 rounded-lg">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-yellow-100">
                            {booking.rating}.0
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Check-in</div>
                          <div className="font-semibold text-gray-100">
                            {formatDate(booking.checkInDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Check-out</div>
                          <div className="font-semibold text-gray-100">
                            {formatDate(booking.checkOutDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Guests</div>
                          <div className="font-semibold text-gray-100">
                            {booking.guests || 1}{" "}
                            {(booking.guests || 1) === 1 ? "Guest" : "Guests"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-gray-300 mb-1">
                          {booking.roomType || "Room"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {booking.nights || 1}{" "}
                          {(booking.nights || 1) === 1 ? "night" : "nights"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-gray-300">
                            Total Amount
                          </div>
                          <div className="text-2xl font-bold text-gray-100">
                            ${booking.totalAmount || booking.totalPrice || 0}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "upcoming" && (
                            <>
                              <button className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 flex items-center gap-2 text-gray-100">
                                <Phone className="w-4 h-4" />
                                <span className="hidden md:inline">
                                  Contact
                                </span>
                              </button>
                              <button className="px-4 py-2 bg-red-700 text-red-100 border border-red-700 rounded-lg hover:bg-red-600">
                                Cancel
                              </button>
                            </>
                          )}

                          {booking.status === "completed" &&
                            !booking.rating && (
                              <button className="px-4 py-2 bg-yellow-600 text-yellow-100 border border-yellow-600 rounded-lg hover:bg-yellow-500 flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Rate Stay
                              </button>
                            )}

                          <button className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 flex items-center gap-2 text-gray-100">
                            <Download className="w-4 h-4 text-gray-100" />
                            <span className="hidden md:inline text-gray-100">
                              Invoice
                            </span>
                          </button>

                          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                            <span>Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="text-3xl font-bold mb-2 text-gray-100">
              {bookings.length}
            </div>
            <div className="text-gray-300 text-sm">Total Bookings</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="text-3xl font-bold mb-2 text-gray-100">
              {bookings.filter((b) => b.status === "upcoming").length}
            </div>
            <div className="text-gray-300 text-sm">Upcoming Trips</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="text-3xl font-bold mb-2 text-gray-100">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="text-gray-300 text-sm">Completed Stays</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="text-3xl font-bold mb-2 text-gray-100">
              $
              {bookings
                .filter((b) => b.status === "completed")
                .reduce(
                  (sum, b) => sum + (b.totalAmount || b.totalPrice || 0),
                  0,
                )}
            </div>
            <div className="text-gray-300 text-sm">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
