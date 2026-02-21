"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

interface HotelDetailSidebarProps {
  hotel: {
    id: string;
    name: string;
    images: string[];
    description: string;
    location: string;
  };
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "reviews", label: "Reviews" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function HotelDetailSidebar({ hotel }: HotelDetailSidebarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState(false);

  const desc = hotel.description;
  const short = desc.length > 120 ? desc.slice(0, 120) + "…" : desc;

  return (
    <div className="w-80 shrink-0 bg-[#0d0d0d] border border-[#1a1a1a] flex flex-col self-start sticky top-8">
      {/* Main image */}
      <div className="relative h-52 overflow-hidden bg-[#111]">
        {hotel.images[0] ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#2a2a2a] text-[10px] tracking-[0.2em] uppercase">
              No Image
            </p>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 60%)",
          }}
        />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1">
            {hotel.location}
          </p>
          <h2
            className="text-white text-sm font-bold uppercase leading-snug"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {hotel.name}
          </h2>
        </div>
      </div>

      {/* Thumbnail strip */}
      {hotel.images.length > 1 && (
        <div
          className="grid gap-px bg-[#1a1a1a]"
          style={{
            gridTemplateColumns: `repeat(${Math.min(hotel.images.slice(1, 4).length, 3)}, 1fr)`,
          }}
        >
          {hotel.images.slice(1, 4).map((img, idx) => (
            <div key={idx} className="h-16 overflow-hidden bg-[#111]">
              <img
                src={img}
                alt={`${hotel.name} ${idx + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1a1a1a]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-[10px] tracking-[0.14em] uppercase py-3.5 transition-colors border-none cursor-pointer ${
              activeTab === tab.id
                ? "text-[#c9a96e] bg-[#161206] border-b border-[#c9a96e]"
                : "text-[#3a3a3a] bg-transparent hover:text-[#6b7280]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 flex-1">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-2">
                About
              </p>
              <p className="text-[#6b7280] text-xs leading-relaxed">
                {expanded ? desc : short}
                {desc.length > 120 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[#c9a96e] text-[10px] ml-1 bg-transparent border-none cursor-pointer uppercase tracking-widest"
                  >
                    {expanded ? "Less" : "More"}
                  </button>
                )}
              </p>
            </div>

            <div>
              <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-3">
                Location
              </p>
              <div className="h-28 bg-[#111] border border-[#1a1a1a] flex items-center justify-center relative overflow-hidden mb-2">
                {/* Decorative map placeholder */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, #1a1a1a, #1a1a1a 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #1a1a1a, #1a1a1a 1px, transparent 1px, transparent 32px)",
                  }}
                />
                <div className="relative flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 border border-[#c9a96e]/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#c9a96e] rounded-full" />
                  </div>
                  <p className="text-[#3a3a3a] text-[9px] tracking-[0.14em] uppercase">
                    {hotel.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4b5563] text-[11px] flex items-center gap-1">
                  <MapPin size={10} className="text-[#c9a96e]" />
                  1.8 km from city centre
                </span>
                <button className="text-[#c9a96e] text-[10px] tracking-[0.12em] uppercase bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity">
                  View Map
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div>
            <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-3">
              Amenities
            </p>
            <p className="text-[#4b5563] text-xs leading-relaxed">
              Hotel details and amenities will be displayed here.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <p className="text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-3">
              Guest Reviews
            </p>
            <p className="text-[#4b5563] text-xs leading-relaxed">
              Guest reviews will be displayed here.
            </p>
          </div>
        )}
      </div>

      {/* Book Now */}
      <div className="p-5 border-t border-[#1a1a1a]">
        <button
          onClick={() => router.push(`/user/booking?hotelId=${hotel.id}`)}
          className="w-full bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase py-3.5 hover:opacity-90 transition-opacity cursor-pointer border-none"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
