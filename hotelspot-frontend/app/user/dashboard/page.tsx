"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import HotelCard from "../_components/HotelCard";
import HotelDetailSidebar from "../_components/HotelDetailSidebar";
import PopularHotelCard from "../_components/PopularHotelCard";
import { handleGetAllHotels } from "@/lib/actions/hotel-action";
import { toast } from "react-toastify";

interface Hotel {
  _id: string;
  hotelName: string;
  address: string;
  city: string;
  country: string;
  rating?: number;
  description?: string;
  price: number;
  availableRooms: number;
  imageUrl?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"hotels">("hotels");

  const [activeFilter, setActiveFilter] = useState<
    "recommended" | "popular" | "nearest"
  >("recommended");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch hotels
  useEffect(() => {
    fetchHotels();
  }, [debouncedSearch]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await handleGetAllHotels("1", "50", debouncedSearch);

      if (response.success) {
        setHotels(response.data || []);

        if (response.data && response.data.length > 0) {
          setSelectedHotel(response.data[0]);
        }
      } else {
        toast.error(response.message || "Failed to fetch hotels");
      }
    } catch (error: any) {
      console.error("Fetch hotels error:", error);
      toast.error(error.message || "Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  // SAME LOGIC AS ADMIN
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return process.env.NEXT_PUBLIC_API_BASE_URL + imageUrl;
  };

  // Featured Hotels
  const featuredHotels = hotels
    .filter((hotel) => hotel.rating && hotel.rating >= 4.5)
    .slice(0, 3);

  // Filter logic
  const filteredHotels = [...hotels].sort((a, b) => {
    if (activeFilter === "recommended") {
      return (b.rating || 0) - (a.rating || 0);
    }

    if (activeFilter === "popular") {
      return b.price - a.price;
    }

    return 0;
  });

  const popularHotels = filteredHotels.slice(0, 6);

  const tabs = [{ id: "hotels", label: "Hotels" }];

  const filters = [
    { id: "recommended", label: "Recommended" },
    { id: "popular", label: "Popular" },
    { id: "nearest", label: "Nearest" },
  ];

  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto min-h-screen">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Hey {user?.fullName || user?.username || "Watson"} !!!
              </h1>
              <p className="text-gray-400">
                Welcome back and explore the world
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-emerald-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search Hotel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-gray-700 focus:border-emerald-500 focus:outline-none bg-gray-800 text-white placeholder-gray-500"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </span>
              </div>

              <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
                <span className="text-white text-xl">☰</span>
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading hotels...</p>
                </div>
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No hotels found</p>
                {searchQuery && (
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your search
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Featured Hotels */}
                {featuredHotels.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Featured Hotels
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredHotels.map((hotel) => (
                        <div
                          key={hotel._id}
                          onClick={() => setSelectedHotel(hotel)}
                        >
                          <HotelCard
                            id={hotel._id}
                            name={hotel.hotelName}
                            location={`${hotel.city}, ${hotel.country}`}
                            rating={hotel.rating || 0}
                            image={getImageUrl(hotel.imageUrl)}
                            price={hotel.price}
                            isFeatured
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-4">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeFilter === filter.id
                            ? "text-white border-b-2 border-emerald-500"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <button className="text-emerald-500 font-medium flex items-center gap-2 hover:text-emerald-400">
                    View All <span>→</span>
                  </button>
                </div>

                {/* Popular Hotels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularHotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      <PopularHotelCard
                        id={hotel._id}
                        name={hotel.hotelName}
                        location={hotel.address}
                        price={hotel.price}
                        image={getImageUrl(hotel.imageUrl)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          {selectedHotel && (
            <HotelDetailSidebar
              hotel={{
                id: selectedHotel._id,
                name: selectedHotel.hotelName,
                images: [getImageUrl(selectedHotel.imageUrl)],
                description:
                  selectedHotel.description ||
                  "A beautiful hotel with excellent amenities and service.",
                location: `${selectedHotel.city}, ${selectedHotel.country}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
