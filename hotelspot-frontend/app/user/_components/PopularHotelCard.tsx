"use client";

import {
  handleAddFavourite,
  handleRemoveFavourite,
} from "@/lib/actions/favourite-action";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Heart, Star } from "lucide-react";

interface PopularHotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  rating?: number;
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
  rating,
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
        const result = await handleRemoveFavourite(currentFavouriteId);
        if (result.success) {
          setIsLiked(false);
          setCurrentFavouriteId(undefined);
          toast.success("Removed from favorites");
          onFavoriteChange?.(id, false);
        } else toast.error(result.message || "Failed to remove from favorites");
      } else {
        const result = await handleAddFavourite(id);
        if (result.success && result.data) {
          setIsLiked(true);
          setCurrentFavouriteId(result.data.favourite._id);
          toast.success("Added to favorites");
          onFavoriteChange?.(id, true);
        } else {
          if (result.message?.toLowerCase().includes("already"))
            toast.info("Hotel already in favorites");
          else toast.error(result.message || "Failed to add to favorites");
        }
      }
    } catch (error: any) {
      if (error.message?.toLowerCase().includes("already"))
        toast.info("Hotel already in favorites");
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="relative bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden cursor-pointer group hover:border-[#2a2a2a] transition-colors"
      onClick={() => {
        window.location.href = `/user/booking?hotelId=${id}`;
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#111]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 50%, transparent 100%)",
          }}
        />

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isProcessing}
          className={`absolute top-3 right-3 w-8 h-8 bg-[#0a0a0a]/80 border border-[#2a2a2a] flex items-center justify-center transition-all z-10 hover:border-[#c9a96e] ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={13}
            className={
              isLiked ? "fill-[#c9a96e] text-[#c9a96e]" : "text-[#6b7280]"
            }
          />
        </button>

        {/* Rating badge */}
        {rating !== undefined && (
          <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 border border-[#2a2a2a] px-2 py-1 flex items-center gap-1">
            <Star size={9} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-[#c9a96e] text-[10px] font-bold">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1.5 truncate">
          {location}
        </p>
        <h3
          className="text-white text-sm font-bold uppercase mb-3 truncate leading-snug"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {name}
        </h3>
        <div className="flex items-end justify-between border-t border-[#1a1a1a] pt-3">
          <div>
            <span
              className="text-white text-base font-bold"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Rs. {price.toLocaleString()}
            </span>
            <span className="text-[#4b5563] text-[11px] ml-1">/night</span>
          </div>
          <span className="text-[#c9a96e] text-[9px] tracking-[0.14em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Book →
          </span>
        </div>
      </div>
    </div>
  );
}
