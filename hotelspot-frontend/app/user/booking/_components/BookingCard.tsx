"use client";

import { useState } from "react";
import {
  formatDate,
  getImageUrl,
  getLocationString,
  getStatusColor,
  getStatusText,
} from "@/app/BookingUtils";
import { Calendar, Users, ChevronRight, Star, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: any;
  hotelData: any;
  onReview: (booking: any) => void;
  onCancel?: (bookingId: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-[#0d1f3c] text-[#60a5fa] border border-[#1e3a5f]",
  confirmed: "bg-[#0d1f3c] text-[#60a5fa] border border-[#1e3a5f]",
  completed: "bg-[#0d2818] text-[#4ade80] border border-[#1a4a2e]",
  cancelled: "bg-[#2d0d0d] text-[#f87171] border border-[#4a1a1a]",
  pending: "bg-[#1f1a0d] text-[#facc15] border border-[#3a3010]",
  checked_in: "bg-[#130a1f] text-[#a78bfa] border border-[#2d1a4a]",
  checked_out: "bg-[#0a0f1f] text-[#60a5fa] border border-[#1a2a4a]",
};

function statusStyle(status: string) {
  return (
    STATUS_STYLES[(status || "").toLowerCase().trim()] ||
    "bg-[#1a1a1a] text-[#6b7280] border border-[#2a2a2a]"
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[#3a3a3a] text-[9px] tracking-[0.18em] uppercase">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[#c9a96e]">{icon}</span>
        <span className="text-white text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}

function CancelModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />
      <div className="relative bg-[#0d0d0d] border border-[#1a1a1a] w-[90%] max-w-md p-8">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white bg-transparent border-none cursor-pointer text-lg leading-none"
        >
          ✕
        </button>
        <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
          Confirm Action
        </p>
        <h2
          className="text-white text-2xl font-bold uppercase mb-5 m-0"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Cancel Booking
        </h2>
        <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#2a2a2a] bg-transparent text-[#9ca3af] text-[11px] tracking-[0.14em] uppercase py-3 cursor-pointer hover:border-[#3a3a3a] hover:text-white transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-[#7f1d1d] border border-[#7f1d1d] text-white text-[11px] tracking-[0.14em] uppercase font-bold py-3 cursor-pointer hover:bg-red-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

const CANCELLABLE_STATUSES = ["upcoming", "confirmed", "pending"];

export default function BookingCard({
  booking,
  hotelData,
  onReview,
  onCancel,
}: BookingCardProps) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const hotelReviewId = hotelData?._id || booking.hotelId || booking.hotel?._id;
  const hotelId = hotelData?._id || booking.hotelId || booking.hotel?._id;

  const canCancel = CANCELLABLE_STATUSES.includes(
    (booking.status || "").toLowerCase(),
  );

  const handleCancel = async () => {
    setCancelling(true);
    await onCancel?.(booking._id || booking.id);
    setCancelling(false);
    setShowCancelModal(false);
  };

  return (
    <>
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onCancel={() => setShowCancelModal(false)}
          loading={cancelling}
        />
      )}

      <div className="border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#2a2a2a] transition-colors">
        <div className="grid" style={{ gridTemplateColumns: "240px 1fr" }}>
          {/* Image */}
          <div className="relative overflow-hidden bg-[#111] h-full min-h-50">
            <img
              src={getImageUrl(hotelData?.imageUrl || booking.image)}
              alt={hotelData?.hotelName || booking.hotelName || "Hotel"}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-3 left-3">
              <span
                className={`text-[10px] px-2 py-1 font-bold tracking-widest uppercase ${statusStyle(booking.status)}`}
              >
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-7">
            {/* Top */}
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1">
                    {getLocationString(hotelData)}
                  </p>
                  <h3
                    className="text-white text-xl font-bold uppercase leading-snug"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {hotelData?.hotelName || booking.hotelName || "Hotel"}
                  </h3>
                </div>
                {booking.rating && (
                  <div className="flex items-center gap-1.5 bg-[#161206] border border-[#c9a96e33] px-3 py-1.5">
                    <Star size={11} className="text-[#c9a96e] fill-[#c9a96e]" />
                    <span className="text-[#c9a96e] text-xs font-bold">
                      {booking.rating}.0
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[#3a3a3a] text-[10px] font-mono mt-1">
                ID: {(booking._id || booking.id || "").slice(-12).toUpperCase()}
                &nbsp;·&nbsp;
                {booking.confirmation || booking.confirmationCode || "—"}
              </p>
            </div>

            {/* Dates + Guests */}
            <div className="grid grid-cols-3 border-t border-b border-[#1a1a1a] py-5 my-5 gap-4">
              <InfoCell
                icon={<Calendar size={13} />}
                label="Check-in"
                value={formatDate(booking.checkInDate)}
              />
              <InfoCell
                icon={<Calendar size={13} />}
                label="Check-out"
                value={formatDate(booking.checkOutDate)}
              />
              <InfoCell
                icon={<Users size={13} />}
                label="Guests"
                value={`${booking.guests || 1} ${
                  (booking.guests || 1) === 1 ? "Guest" : "Guests"
                }`}
              />
            </div>

            {/* Bottom */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[#3a3a3a] text-[9px] tracking-[0.18em] uppercase mb-1">
                  {booking.nights || 1}{" "}
                  {(booking.nights || 1) === 1 ? "Night" : "Nights"}
                </p>
                <p
                  className="text-white text-2xl font-bold"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Rs.{" "}
                  {(
                    booking.totalAmount ||
                    booking.totalPrice ||
                    0
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {canCancel && (
                  <>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="border border-[#7f1d1d] text-[#f87171] text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:bg-[#7f1d1d] hover:text-white transition-colors bg-transparent cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    router.push(`/user/review?hotelId=${hotelReviewId}`)
                  }
                  className="border border-[#2a2a2a] text-[#6b7280] text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors bg-transparent cursor-pointer flex items-center gap-1.5"
                >
                  <Star size={12} /> Review
                </button>
                <button
                  onClick={() =>
                    router.push(`/user/booking?hotelId=${hotelId}`)
                  }
                  className="bg-[#c9a96e] text-[#0a0a0a] text-[10px] font-bold tracking-[0.14em] uppercase px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center gap-1.5"
                >
                  Details <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
