"use client";

import {
  handleAddFavourite,
  handleRemoveFavourite,
} from "@/lib/actions/favourite-action";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  price?: number;
  isFeatured?: boolean;
  isFavorited?: boolean;
  favouriteId?: string;
  onFavoriteChange?: (hotelId: string, isFavorited: boolean) => void;
}

export default function HotelCard({
  id,
  name,
  location,
  rating,
  image,
  price,
  isFeatured = false,
  isFavorited = false,
  favouriteId,
  onFavoriteChange,
}: HotelCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorited);
  const [currentFavouriteId, setCurrentFavouriteId] = useState(favouriteId);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsLiked(isFavorited);
    setCurrentFavouriteId(favouriteId);
  }, [isFavorited, favouriteId]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (isLiked && currentFavouriteId) {
        // Remove from favorites
        const result = await handleRemoveFavourite(currentFavouriteId);

        if (result.success) {
          setIsLiked(false);
          setCurrentFavouriteId(undefined);
          toast.success("Removed from favorites");
          onFavoriteChange?.(id, false);
        } else {
          toast.error(result.message || "Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const result = await handleAddFavourite(id);

        if (result.success && result.data) {
          setIsLiked(true);
          setCurrentFavouriteId(result.data.favourite._id);
          toast.success("Added to favorites");
          onFavoriteChange?.(id, true);
        } else {
          // Check if already in favorites
          if (result.message?.toLowerCase().includes("already")) {
            toast.info("Hotel already in favorites");
          } else {
            toast.error(result.message || "Failed to add to favorites");
          }
        }
      }
    } catch (error: any) {
      console.error("Favorite action error:", error);
      if (error.message?.toLowerCase().includes("already")) {
        toast.info("Hotel already in favorites");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
        isFeatured ? "h-80" : "h-64"
      }`}
      onClick={() => {
        window.location.href = `/user/booking?hotelId=${id}`;
      }}
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
        onClick={handleFavoriteClick}
        disabled={isProcessing}
        className={`absolute top-4 right-4 w-10 h-10 bg-gray-900/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-900/80 transition-all z-10 ${
          isProcessing ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      >
        <span className={`text-xl ${isLiked ? "text-red-500" : "text-white"}`}>
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
