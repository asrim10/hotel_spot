"use client";

import {
  handleAddFavourite,
  handleRemoveFavourite,
} from "@/lib/actions/favourite-action";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface PopularHotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  isFavorited?: boolean;
  favouriteId?: string;
  onFavoriteChange?: (hotelId: string, isFavorited: boolean) => void;
}

export default function PopularHotelCard({
  id,
  name,
  location,
  price,
  image,
  isFavorited = false,
  favouriteId,
  onFavoriteChange,
}: PopularHotelCardProps) {
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
      className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={() => {
        window.location.href = `/user/booking?hotelId=${id}`;
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

        {/* Like Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isProcessing}
          className={`absolute top-3 right-3 w-9 h-9 bg-gray-900/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-900/80 transition-all z-10 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <span
            className={`text-lg ${isLiked ? "text-red-500" : "text-white"}`}
          >
            {isLiked ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <span className="text-emerald-400">📍</span>
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-bold text-lg">
              Rs. {price.toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm ml-1">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}
