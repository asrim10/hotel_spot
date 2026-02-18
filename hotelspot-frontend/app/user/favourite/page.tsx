"use client";

import { useEffect, useState } from "react";
import { Heart, Search, Grid, List, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import HotelCard from "@/app/user/_components/HotelCard";
import { handleGetMyFavourites } from "@/lib/actions/favourite-action";

interface FavoriteWithHotel {
  _id: string;
  hotelId: string;
  hotel: {
    hotelName: string;
    address: string;
    city: string;
    country: string;
    rating: number;
    imageUrl: string;
    price: number;
    description?: string;
  } | null;
}

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<FavoriteWithHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const result = await handleGetMyFavourites();

      if (result.success && Array.isArray(result.data)) {
        setFavorites(result.data);
      } else {
        setFavorites([]);
        if (!result.success) {
          toast.error(result.message || "Failed to load favorites");
        }
      }
    } catch (err: any) {
      console.error("Error loading favorites:", err);
      toast.error(err.message || "Failed to load favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadFavorites();
  }, [user]);

  const filteredFavorites = favorites.filter((fav) => {
    if (!fav.hotel) return false;

    const hotelName = fav.hotel.hotelName || "";
    const address = fav.hotel.address || "";
    const city = fav.hotel.city || "";
    const country = fav.hotel.country || "";
    const location = [address, city, country].filter(Boolean).join(", ");

    return (
      hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleFavoriteChange = (hotelId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      // Remove from local state
      setFavorites(favorites.filter((fav) => fav.hotelId !== hotelId));
    }
  };

  const getLocationString = (hotel: FavoriteWithHotel["hotel"]) => {
    if (!hotel) return "Location";

    const address = hotel.address || "";
    const city = hotel.city || "";
    const country = hotel.country || "";
    const parts = [address, city, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Favorites</h1>
              <p className="text-gray-300 text-sm mt-1">
                {favorites.length}{" "}
                {favorites.length === 1 ? "property" : "properties"} saved
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Controls */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-700 text-gray-100">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Sort</span>
              </button>
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-emerald-600 text-white" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 border-l border-gray-700 ${viewMode === "list" ? "bg-emerald-600 text-white" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-300">Loading your favorites...</div>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-100">
              {searchQuery
                ? "No favorites match your search"
                : "No favorites found"}
            </h3>
            <p className="text-gray-300 mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start exploring and save your favorite hotels"}
            </p>
            <a
              href="/user/dashboard"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Explore Hotels
            </a>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => {
              const hotel = favorite.hotel;
              if (!hotel) return null;

              return (
                <HotelCard
                  key={favorite._id}
                  id={favorite.hotelId}
                  name={hotel.hotelName}
                  location={getLocationString(hotel)}
                  rating={hotel.rating || 0}
                  image={
                    hotel.imageUrl
                      ? (process.env.NEXT_PUBLIC_API_BASE_URL || "") +
                        hotel.imageUrl
                      : "/api/placeholder/400/300"
                  }
                  price={hotel.price}
                  isFavorited={true}
                  favouriteId={favorite._id}
                  onFavoriteChange={handleFavoriteChange}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => {
              const hotel = favorite.hotel;
              if (!hotel) return null;

              return (
                <div
                  key={favorite._id}
                  className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-80 h-48 lg:h-auto relative">
                      <img
                        src={
                          hotel.imageUrl
                            ? (process.env.NEXT_PUBLIC_API_BASE_URL || "") +
                              hotel.imageUrl
                            : "/api/placeholder/400/300"
                        }
                        alt={hotel.hotelName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-100">
                          Rs. {hotel.price || 0}/night
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 text-gray-100">
                            {hotel.hotelName}
                          </h3>
                          <div className="flex items-center text-gray-300 text-sm mb-2">
                            <span className="text-emerald-300 mr-1">📍</span>
                            {getLocationString(hotel)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="font-semibold text-gray-100">
                              {hotel.rating || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {hotel.description || "No description available"}
                      </p>

                      <div className="flex gap-2">
                        <a
                          href={`/user/booking?hotelId=${favorite.hotelId}`}
                          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-center"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
