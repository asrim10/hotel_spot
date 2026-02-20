"use client";

import {
  formatDate,
  getImageUrl,
  getLocationString,
  getStatusColor,
  getStatusText,
} from "@/app/BookingUtils";
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Star,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: any;
  hotelData: any;
  onReview: (booking: any) => void;
}

export default function BookingCard({
  booking,
  hotelData,
  onReview,
}: BookingCardProps) {
  const router = useRouter();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-80 h-48 lg:h-auto shrink-0">
          <img
            src={getImageUrl(hotelData?.imageUrl || booking.image)}
            alt={hotelData?.hotelName || booking.hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-100">
                  {hotelData?.hotelName || booking.hotelName || "Hotel"}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>
              <div className="flex items-center text-gray-300 text-sm mb-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-300" />
                {getLocationString(hotelData)}
              </div>
              <div className="text-sm text-gray-400">
                Booking ID: {booking._id || booking.id} • Confirmation:{" "}
                {booking.confirmation || booking.confirmationCode || "-"}
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
                <div className="text-sm text-gray-300">Total Amount</div>
                <div className="text-2xl font-bold text-gray-100">
                  Rs.{booking.totalAmount || booking.totalPrice || 0}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {booking.status === "upcoming" && (
                  <>
                    <button className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 flex items-center gap-2 text-gray-100">
                      <Phone className="w-4 h-4" />
                      <span className="hidden md:inline">Contact</span>
                    </button>
                    <button className="px-4 py-2 bg-red-700 text-red-100 border border-red-700 rounded-lg hover:bg-red-600">
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    router.push(
                      `/user/review?hotelId=${hotelData?._id || booking.hotelId || booking.hotel?._id}`,
                    )
                  }
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 flex items-center gap-2 text-gray-100"
                >
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="hidden md:inline">Review</span>
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
  );
}
