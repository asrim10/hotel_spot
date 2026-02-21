"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { handleGetMyFavourites } from "@/lib/actions/favourite-action";
import { FavoritesSearchBar } from "./_components/FavouriteSearch";
import { FavoriteListCard } from "./_components/FavouriteList";
import { FavoriteEmptyState } from "./_components/FavouriteEmpty";
import { FavoriteGridCard } from "./_components/FavouriteGrid";

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
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<FavoriteWithHotel[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const result = await handleGetMyFavourites();
      if (result.success && Array.isArray(result.data))
        setFavorites(result.data);
      else {
        setFavorites([]);
        if (!result.success)
          toast.error(result.message || "Failed to load favorites");
      }
    } catch (err: any) {
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

  const filtered = favorites.filter((fav) => {
    if (!fav.hotel) return false;
    const q = searchQuery.toLowerCase();
    const loc = [fav.hotel.address, fav.hotel.city, fav.hotel.country]
      .filter(Boolean)
      .join(", ");
    return (
      fav.hotel.hotelName.toLowerCase().includes(q) ||
      loc.toLowerCase().includes(q)
    );
  });

  const handleFavoriteChange = (hotelId: string, isFavorited: boolean) => {
    if (!isFavorited)
      setFavorites((prev) => prev.filter((f) => f.hotelId !== hotelId));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* PAGE HEADER */}
      <div className="border-b border-[#1a1a1a] px-12 py-12 flex items-end justify-between">
        <div>
          <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
            My Collection
          </p>
          <h1
            className="text-white text-5xl font-bold uppercase leading-tight m-0"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Favorites
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="border border-[#1a1a1a] flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 flex items-center justify-center transition-colors cursor-pointer border-none ${
                viewMode === "grid"
                  ? "bg-[#161206] text-[#c9a96e]"
                  : "bg-transparent text-[#3a3a3a] hover:text-[#6b7280]"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 flex items-center justify-center transition-colors cursor-pointer border-none border-l border-[#1a1a1a] ${
                viewMode === "list"
                  ? "bg-[#161206] text-[#c9a96e]"
                  : "bg-transparent text-[#3a3a3a] hover:text-[#6b7280]"
              }`}
            >
              <List size={15} />
            </button>
          </div>
          <Heart size={18} className="text-[#c9a96e]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="px-12 py-10">
        {/* SEARCH BAR */}
        <div className="mb-8">
          <FavoritesSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            count={favorites.length}
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[#0d0d0d] border border-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <FavoriteEmptyState isFiltered={!!searchQuery} />
        ) : (
          <>
            {/* GRID VIEW */}
            {viewMode === "grid" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-px bg-[#1a1a1a]"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                }}
              >
                {filtered.map((fav) => {
                  if (!fav.hotel) return null;
                  return (
                    <div key={fav._id} className="bg-[#0a0a0a]">
                      <FavoriteGridCard
                        favoriteId={fav._id}
                        hotelId={fav.hotelId}
                        hotel={fav.hotel}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-[#1a1a1a]"
              >
                {filtered.map((fav, i) => {
                  if (!fav.hotel) return null;
                  return (
                    <FavoriteListCard
                      key={fav._id}
                      favoriteId={fav._id}
                      hotelId={fav.hotelId}
                      hotel={fav.hotel}
                      index={i}
                      onRemove={(hotelId) =>
                        handleFavoriteChange(hotelId, false)
                      }
                    />
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
