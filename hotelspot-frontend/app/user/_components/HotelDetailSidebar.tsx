"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HotelDetailSidebarProps {
  hotel: {
    id: string;
    name: string;
    images: string[];
    description: string;
    location: string;
  };
}

export default function HotelDetailSidebar({ hotel }: HotelDetailSidebarProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "reviews"
  >("overview");
  const [currentMonth, setCurrentMonth] = useState("February 2025");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "reviews", label: "Reviews" },
  ];

  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);
  const selectedDates = [11, 15];

  const handleBookNow = () => {
    router.push(`/user/booking?hotelId=${hotel.id}`);
  };

  return (
    <div className="w-96 bg-white rounded-2xl p-6 shadow-lg">
      {/* Main Image */}
      <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
        <img
          src={hotel.images[0] || "/placeholder-hotel.jpg"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {hotel.images.slice(1, 3).map((img, idx) => (
          <div key={idx} className="relative h-20 rounded-lg overflow-hidden">
            <img
              src={img}
              alt={`${hotel.name} ${idx + 2}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "overview" | "details" | "reviews")
            }
            className={`pb-2 px-1 font-medium transition-all ${
              activeTab === tab.id
                ? "text-gray-800 border-b-2 border-emerald-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {hotel.description}
            <button className="text-emerald-600 font-medium ml-1">
              Read More
            </button>
          </p>

          {/* Location */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Location</h4>
            <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 opacity-50" />
              <div className="relative">
                <div className="w-24 h-24 border-2 border-red-500 rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">1.8 km from city</span>
              <button className="text-emerald-600 font-medium">View Map</button>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth("January 2025")}
                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200"
              >
                ←
              </button>
              <h4 className="font-bold text-gray-800">{currentMonth}</h4>
              <button
                onClick={() => setCurrentMonth("March 2025")}
                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 font-medium mb-1"
                >
                  {day}
                </div>
              ))}
              {daysInMonth.map((day) => (
                <button
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    selectedDates.includes(day)
                      ? "bg-emerald-500 text-white font-bold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="text-gray-600 text-sm">
          <p>Hotel details and amenities will be displayed here...</p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="text-gray-600 text-sm">
          <p>Guest reviews will be displayed here...</p>
        </div>
      )}

      {/* Book Now Button */}
      <div className="mt-6">
        <button
          onClick={handleBookNow}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all shadow-md"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
