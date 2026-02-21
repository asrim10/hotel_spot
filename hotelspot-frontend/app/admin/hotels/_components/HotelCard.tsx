"use client";

import { useState } from "react";
import { handleDeleteHotel } from "@/lib/actions/admin/hotel-action";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, BedDouble, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
  _id: string;
  hotelName: string;
  address: string;
  city: string;
  country: string;
  rating?: number;
  description?: string;
  price: number;
  availableRooms: number;
  imageUrl?: string;
}

function ConfirmModal({
  hotel,
  onClose,
  onConfirm,
}: {
  hotel: Hotel;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/85" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-[#0d0d0d] border border-[#1a1a1a] w-[90%] max-w-sm p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <X size={16} />
        </button>
        <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
          Confirm Action
        </p>
        <h3
          className="text-white text-lg font-bold uppercase mb-4 m-0"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Delete Hotel
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed mb-8">
          Are you sure you want to delete{" "}
          <strong className="text-white">{hotel.hotelName}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-2.5 hover:text-white hover:border-[#3a3a3a] transition-colors cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#7f1d1d] border border-[#7f1d1d] text-white text-[11px] font-bold tracking-[0.14em] uppercase px-6 py-2.5 hover:bg-red-900 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function HotelCards({ hotels }: { hotels: Hotel[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const handleConfirmDelete = async () => {
    if (!selectedHotel) return;
    setDeletingId(selectedHotel._id);
    try {
      const res = await handleDeleteHotel(selectedHotel._id);
      if (res.success) {
        toast.success("Hotel deleted");
        router.refresh();
      } else toast.error(res.message || "Failed to delete hotel");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete hotel");
    } finally {
      setDeletingId(null);
      setSelectedHotel(null);
    }
  };

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 border-t border-[#1a1a1a]">
        <p className="text-[#2a2a2a] text-[11px] tracking-[0.2em] uppercase mb-8">
          No hotels found
        </p>
        <Link
          href="/admin/hotels/create"
          className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase px-8 py-3.5 hover:opacity-90 transition-opacity no-underline"
        >
          + Create First Hotel
        </Link>
      </div>
    );
  }

  return (
    <div className="px-12 py-10 pb-16">
      <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase mb-6">
        {hotels.length} {hotels.length === 1 ? "property" : "properties"}
      </p>

      <div
        className="grid border-t border-l border-[#1a1a1a]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 1,
        }}
      >
        {hotels.map((hotel, i) => (
          <motion.div
            key={hotel._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-[#0d0d0d] border-r border-b border-[#1a1a1a] flex flex-col"
          >
            <div className="relative h-45 overflow-hidden bg-[#111] shrink-0">
              {hotel.imageUrl ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_BASE_URL + hotel.imageUrl}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 block"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[#2a2a2a] text-[10px] tracking-[0.2em] uppercase">
                    No Image
                  </p>
                </div>
              )}
              {hotel.rating !== undefined && (
                <div className="absolute top-3 right-3 bg-[#0a0a0a]/90 border border-[#2a2a2a] px-2.5 py-1 flex items-center gap-1.5">
                  <Star size={10} className="text-[#c9a96e] fill-[#c9a96e]" />
                  <span className="text-[#c9a96e] text-[11px] font-bold">
                    {hotel.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1.5">
                {hotel.city}, {hotel.country}
              </p>
              <h3
                className="text-white text-[15px] font-bold mb-1.5 uppercase truncate leading-snug"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {hotel.hotelName}
              </h3>
              <p className="text-[#4b5563] text-[11px] mb-3.5 truncate">
                {hotel.address}
              </p>
              {hotel.description && (
                <p className="text-[#4b5563] text-[11px] leading-relaxed mb-4 line-clamp-2">
                  {hotel.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span
                      className="text-white text-[19px] font-bold"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      Rs. {hotel.price.toLocaleString()}
                    </span>
                    <span className="text-[#4b5563] text-[11px] ml-1">
                      /night
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BedDouble size={11} className="text-[#4b5563]" />
                    <span className="text-[#4b5563] text-[11px]">
                      {hotel.availableRooms} rooms
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/hotels/${hotel._id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-[#2a2a2a] text-[#9ca3af] text-[11px] font-semibold tracking-widest uppercase py-2.5 no-underline hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    disabled={deletingId === hotel._id}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-[#2a2a2a] text-[#9ca3af] text-[11px] font-semibold tracking-widest uppercase py-2.5 hover:border-[#f87171] hover:text-[#f87171] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={11} />
                    {deletingId === hotel._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedHotel && (
          <ConfirmModal
            hotel={selectedHotel}
            onClose={() => setSelectedHotel(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
