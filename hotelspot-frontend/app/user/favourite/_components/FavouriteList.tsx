"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Hotel {
  hotelName: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  imageUrl: string;
  price: number;
  description?: string;
}

interface FavoriteListCardProps {
  favoriteId: string;
  hotelId: string;
  hotel: Hotel;
  index: number;
  onRemove: (hotelId: string) => void;
}

export function FavoriteListCard({
  favoriteId,
  hotelId,
  hotel,
  index,
  onRemove,
}: FavoriteListCardProps) {
  const location = [hotel.address, hotel.city, hotel.country]
    .filter(Boolean)
    .join(", ");
  const imageUrl = hotel.imageUrl
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "") + hotel.imageUrl
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-[#1a1a1a] grid items-stretch hover:bg-[#0d0d0d] transition-colors"
      style={{ gridTemplateColumns: "260px 1fr" }}
    >
      {/* Image */}
      <div className="relative h-[160px] overflow-hidden bg-[#111]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotel.hotelName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#2a2a2a] text-[10px] tracking-[0.2em] uppercase">
              No Image
            </p>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span
            className="bg-[#0a0a0a]/90 border border-[#2a2a2a] text-[#c9a96e] text-xs font-bold px-2.5 py-1"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Rs. {hotel.price.toLocaleString()}
            <span className="text-[#4b5563] font-normal text-[10px]">
              /night
            </span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 flex flex-col justify-between">
        <div>
          <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1.5">
            {location}
          </p>
          <h3
            className="text-white text-lg font-bold uppercase mb-3 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {hotel.hotelName}
          </h3>
          <div className="flex items-center gap-1.5 mb-4">
            <Star size={11} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-[#c9a96e] text-xs font-bold">
              {hotel.rating?.toFixed(1) || "—"}
            </span>
          </div>
          {hotel.description && (
            <p className="text-[#4b5563] text-sm leading-relaxed line-clamp-2">
              {hotel.description}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <Link
            href={`/user/booking?hotelId=${hotelId}`}
            className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.14em] uppercase px-6 py-2.5 hover:opacity-90 transition-opacity no-underline"
          >
            Book Now
          </Link>
          <Link
            href={`/user/reviews?hotelId=${hotelId}`}
            className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-2.5 hover:border-[#3a3a3a] hover:text-[#9ca3af] transition-colors no-underline"
          >
            Reviews
          </Link>
          <button
            onClick={() => onRemove(hotelId)}
            className="ml-auto text-[#3a3a3a] text-[10px] tracking-[0.14em] uppercase hover:text-[#f87171] transition-colors bg-transparent border-none cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
