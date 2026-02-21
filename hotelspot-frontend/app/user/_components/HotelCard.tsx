"use client";

import {
  handleAddFavourite,
  handleRemoveFavourite,
} from "@/lib/actions/favourite-action";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

  const goToBooking = () => {
    window.location.href = `/user/booking?hotelId=${id}`;
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${isFeatured ? "h-80" : "h-64"}`}
      onClick={goToBooking}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 55%, rgba(10,10,10,0.05) 100%)",
          }}
        />
      </div>

      {/* Favorite button */}
      <button
        onClick={handleFavoriteClick}
        disabled={isProcessing}
        className={`absolute top-3 right-3 w-8 h-8 bg-[#0a0a0a]/75 border border-[#2a2a2a] flex items-center justify-center transition-all z-10 hover:border-[#c9a96e] ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={13}
          className={
            isLiked ? "fill-[#c9a96e] text-[#c9a96e]" : "text-[#6b7280]"
          }
        />
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3
          className="text-white font-bold uppercase leading-snug mb-1.5 truncate"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: isFeatured ? 20 : 16,
          }}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <MapPin size={10} className="text-[#c9a96e] shrink-0" />
          <span className="text-[#9ca3af] truncate">{location}</span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <Star size={10} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-[#c9a96e] font-bold text-[11px]">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        {price !== undefined && (
          <p
            className="text-white text-sm font-bold mt-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Rs. {price.toLocaleString()}
            <span className="text-[#4b5563] text-xs font-normal ml-1">
              /night
            </span>
          </p>
        )}
      </div>

      {/* Featured arrow — navigates to booking */}
      {isFeatured && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToBooking();
          }}
          className="absolute bottom-5 right-5 w-8 h-8 bg-[#c9a96e] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer border-none z-10"
        >
          <ArrowRight size={14} className="text-[#0a0a0a]" />
        </button>
      )}
    </div>
  );
}
