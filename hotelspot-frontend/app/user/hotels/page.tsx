"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Wifi,
  Car,
  Waves,
  Utensils,
  Dumbbell,
  Wind,
} from "lucide-react";
import { getAllHotels } from "@/lib/api/hotel";
import HotelCard from "./_components/HotelCard";
import HotelFilters from "./_components/HotelFilters";
import HotelsHero from "./_components/HotelsHero";

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    rating: "",
    amenities: [] as string[],
    sortBy: "default",
  });

  useEffect(() => {
    getAllHotels()
      .then((res: any) => {
        if (res?.success && Array.isArray(res.data)) setHotels(res.data);
        else if (Array.isArray(res)) setHotels(res);
        else setHotels([]);
      })
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...hotels];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          (h.hotelName || h.name || "").toLowerCase().includes(q) ||
          (h.city || "").toLowerCase().includes(q) ||
          (h.country || "").toLowerCase().includes(q) ||
          (h.address || "").toLowerCase().includes(q),
      );
    }

    if (filters.minPrice)
      list = list.filter((h) => (h.price || 0) >= Number(filters.minPrice));
    if (filters.maxPrice)
      list = list.filter((h) => (h.price || 0) <= Number(filters.maxPrice));
    if (filters.rating)
      list = list.filter((h) => (h.rating || 0) >= Number(filters.rating));
    if (filters.amenities.length > 0)
      list = list.filter((h) =>
        filters.amenities.every((a) => (h.amenities || []).includes(a)),
      );

    if (filters.sortBy === "price_asc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sortBy === "price_desc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (filters.sortBy === "rating")
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [hotels, searchQuery, filters]);

  const activeFilterCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.sortBy !== "default" ? filters.sortBy : "",
    ...filters.amenities,
  ].filter(Boolean).length;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <HotelsHero total={hotels.length} />

      {/* SEARCH + FILTER BAR */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="px-12 py-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
            />
            <input
              type="text"
              placeholder="Search by hotel name, city, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white text-sm pl-10 pr-4 py-3 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3a3a] hover:text-white bg-transparent border-none cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border text-[10px] tracking-[0.16em] uppercase px-5 py-3 cursor-pointer transition-colors bg-transparent ${
              showFilters || activeFilterCount > 0
                ? "border-[#c9a96e] text-[#c9a96e]"
                : "border-[#2a2a2a] text-[#6b7280] hover:border-[#3a3a3a] hover:text-[#9ca3af]"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#c9a96e] text-[#0a0a0a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          <p className="text-[#3a3a3a] text-[10px] tracking-[0.16em] uppercase ml-auto">
            {filtered.length} of {hotels.length} hotels
          </p>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[#1a1a1a]"
            >
              <HotelFilters
                filters={filters}
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HOTELS GRID */}
      <div className="px-12 py-12">
        {loading ? (
          <div className="grid grid-cols-3 gap-px bg-[#1a1a1a]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0a0a0a] h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center border-t border-[#1a1a1a]">
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-4">
              No Results
            </p>
            <h2 className="text-white text-3xl font-bold uppercase mb-3">
              No Hotels Found
            </h2>
            <p className="text-[#4b5563] text-sm mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilters({
                  minPrice: "",
                  maxPrice: "",
                  rating: "",
                  amenities: [],
                  sortBy: "default",
                });
              }}
              className="border border-[#2a2a2a] text-[#9ca3af] text-[10px] tracking-[0.16em] uppercase px-6 py-3 bg-transparent cursor-pointer hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-px bg-[#1a1a1a]">
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel._id || hotel.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0a0a0a]"
              >
                <HotelCard
                  hotel={hotel}
                  onBook={() =>
                    router.push(
                      `/user/booking?hotelId=${hotel._id || hotel.id}`,
                    )
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
