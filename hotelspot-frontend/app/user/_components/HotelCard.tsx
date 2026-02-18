"use client";
import { useState } from "react";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  price?: number;
  isFeatured?: boolean;
}

export default function HotelCard({
  id,
  name,
  location,
  rating,
  image,
  price,
  isFeatured = false,
}: HotelCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
        isFeatured ? "h-80" : "h-64"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className="absolute top-4 right-4 w-10 h-10 bg-gray-600 backdrop-blur rounded-full flex items-center justify-center hover:bg-black transition-all z-10"
      >
        <span
          className={`text-xl ${isLiked ? "text-red-500" : "text-gray-400"}`}
        >
          {isLiked ? "❤️" : "🤍"}
        </span>
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-bold text-xl mb-1">{name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-emerald-300">📍</span>
          <span>{location}</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            {rating}
          </span>
        </div>
        {price && (
          <div className="mt-2 text-sm font-semibold">
            Rs. {price.toFixed(2)}{" "}
            <span className="text-sm font-normal">/night</span>
          </div>
        )}
      </div>

      {/* Next Button for Featured */}
      {isFeatured && (
        <button className="absolute bottom-5 right-5 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
          <span className="text-white text-xl">→</span>
        </button>
      )}
    </div>
  );
}
