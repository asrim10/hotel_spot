"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Waves,
  Utensils,
  Dumbbell,
} from "lucide-react";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Free Wi-Fi": <Wifi size={11} />,
  "Free Parking": <Car size={11} />,
  "Swimming Pool": <Waves size={11} />,
  Restaurant: <Utensils size={11} />,
  Gym: <Dumbbell size={11} />,
};

export default function HotelCard({
  hotel,
  onBook,
}: {
  hotel: any;
  onBook: () => void;
}) {
  const getImageUrl = (url?: string) => {
    if (!url) return "/api/placeholder/600/400";
    if (url.startsWith("http")) return url;
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + url;
  };

  const location = [hotel.city, hotel.country].filter(Boolean).join(", ");
  const amenities = (hotel.amenities || []).slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#111]"
        style={{ height: 220 }}
      >
        <img
          src={getImageUrl(hotel.imageUrl)}
          alt={hotel.hotelName || hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 60%)",
          }}
        />
        {hotel.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0a0a0a]/90 border border-[#c9a96e33] px-2.5 py-1.5">
            <Star size={10} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-[#c9a96e] text-xs font-bold">
              {hotel.rating}
            </span>
          </div>
        )}
        {location && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <MapPin size={10} className="text-[#c9a96e]" />
            <span className="text-white text-[10px] tracking-widest uppercase">
              {location}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <p className="text-[#3a3a3a] text-[9px] tracking-[0.18em] uppercase mb-1.5">
            {hotel.type || "Hotel"}
          </p>
          <h3
            className="text-white text-lg font-bold uppercase leading-snug m-0 group-hover:text-[#c9a96e] transition-colors"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {hotel.hotelName || hotel.name}
          </h3>
          {hotel.description && (
            <p className="text-[#4b5563] text-xs leading-relaxed mt-2 line-clamp-2">
              {hotel.description}
            </p>
          )}
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {amenities.map((a: string) => (
              <span
                key={a}
                className="flex items-center gap-1 text-[#6b7280] text-[9px] tracking-widest uppercase border border-[#1a1a1a] px-2 py-1"
              >
                {AMENITY_ICONS[a] || null}
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#1a1a1a]">
          <div>
            <p className="text-[#3a3a3a] text-[9px] tracking-[0.16em] uppercase mb-1">
              Per night
            </p>
            <p
              className="text-white text-xl font-bold m-0"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Rs.{" "}
              <span className="text-[#c9a96e]">
                {(hotel.price || 0).toLocaleString()}
              </span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBook}
            className="bg-[#c9a96e] text-[#0a0a0a] text-[10px] font-bold tracking-[0.16em] uppercase px-5 py-2.5 border-none cursor-pointer hover:opacity-90 transition-opacity"
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
