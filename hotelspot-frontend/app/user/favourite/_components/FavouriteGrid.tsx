"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import HotelCard from "@/app/user/_components/HotelCard";

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

interface FavoriteGridCardProps {
  favoriteId: string;
  hotelId: string;
  hotel: Hotel;
  onFavoriteChange: (hotelId: string, isFavorited: boolean) => void;
}

export function FavoriteGridCard({
  favoriteId,
  hotelId,
  hotel,
  onFavoriteChange,
}: FavoriteGridCardProps) {
  const location = [hotel.address, hotel.city, hotel.country]
    .filter(Boolean)
    .join(", ");
  const imageUrl = hotel.imageUrl
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "") + hotel.imageUrl
    : undefined;

  return (
    <HotelCard
      id={hotelId}
      name={hotel.hotelName}
      location={location}
      rating={hotel.rating || 0}
      image={imageUrl || "/api/placeholder/400/300"}
      price={hotel.price}
      isFavorited={true}
      favouriteId={favoriteId}
      onFavoriteChange={onFavoriteChange}
    />
  );
}
