"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import HotelCard from "../_components/HotelCard";
import HotelDetailSidebar from "../_components/HotelDetailSidebar";
import PopularHotelCard from "../_components/PopulatHotelCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "destination" | "hotels" | "car" | "packages"
  >("hotels");
  const [activeFilter, setActiveFilter] = useState<
    "recommended" | "popular" | "nearest"
  >("popular");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data for featured hotels
  const featuredHotels = [
    {
      id: "1",
      name: "Foto Hotel Phuket",
      location: "Phuket",
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
      id: "2",
      name: "Marriott Resort SHA+",
      location: "Phuket",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    },
    {
      id: "3",
      name: "Novotel Phuket City",
      location: "Phuket City",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    },
  ];

  // Dummy data for popular hotels
  const popularHotels = [
    {
      id: "4",
      name: "Holly Cottage",
      location: "Alice Court, Annapolis MD 21401",
      price: 110.0,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
    },
    {
      id: "5",
      name: "The Stables",
      location: "Terry Lane, Golden CO 80403",
      price: 90.0,
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500",
    },
    {
      id: "6",
      name: "The Old Rectory",
      location: "Yale Street, Arvada CO 80007",
      price: 50.0,
      image:
        "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=500",
    },
    {
      id: "7",
      name: "Seaside Villa",
      location: "Ocean Drive, Miami FL 33139",
      price: 150.0,
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
    },
    {
      id: "8",
      name: "Mountain Lodge",
      location: "Pine Street, Aspen CO 81611",
      price: 200.0,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
    },
    {
      id: "9",
      name: "Urban Loft",
      location: "Broadway, New York NY 10012",
      price: 180.0,
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500",
    },
  ];

  // Selected hotel for detail sidebar
  const selectedHotel = {
    id: "3",
    name: "Novotel Phuket City",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
    ],
    description:
      "Choose between our 8 bedrooms, many with seaviews and relaxing sun terraces. The Isle of Wight offers over 500 miles of footpaths across diverse landscapes.",
    location: "Phuket City, Thailand",
  };

  const tabs = [
    { id: "destination", label: "Destination" },
    { id: "hotels", label: "Hotels" },
    { id: "car", label: "Car Rent" },
    { id: "packages", label: "Packages" },
  ];

  const filters = [
    { id: "recommended", label: "Recommended" },
    { id: "popular", label: "Popular" },
    { id: "nearest", label: "Nearest" },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Hey {user?.fullName || user?.username || "Watson"} !!!
              </h1>
              <p className="text-gray-500">
                Welcome back and explore the world
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-gray-800 border-b-2 border-gray-800"
                      : "text-gray-400 hover:text-gray-600"
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
                  className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-emerald-500 focus:outline-none bg-white"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </span>
              </div>
              <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
                <span className="text-white text-xl">☰</span>
              </button>
            </div>

            {/* Featured Hotels Carousel */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} {...hotel} isFeatured />
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeFilter === filter.id
                        ? "text-gray-800 border-b-2 border-gray-800"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button className="text-emerald-600 font-medium flex items-center gap-2 hover:text-emerald-700">
                View All <span>→</span>
              </button>
            </div>

            {/* Popular Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularHotels.map((hotel) => (
                <PopularHotelCard key={hotel.id} {...hotel} />
              ))}
            </div>
          </div>

          {/* Right Sidebar - Hotel Details */}
          <HotelDetailSidebar hotel={selectedHotel} />
        </div>
      </div>
    </div>
  );
}
