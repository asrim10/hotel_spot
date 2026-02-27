"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const HotelMap = dynamic(() => import("./HotelMap"), { ssr: false });

interface HotelDetailSidebarProps {
  hotel: {
    id: string;
    name: string;
    images: string[];
    description: string;
    location: string;
    coordinates?: { lat: number; lng: number };
  };
}

const TABS = [{ id: "overview", label: "Overview" }] as const;

type Tab = (typeof TABS)[number]["id"];

export default function HotelDetailSidebar({ hotel }: HotelDetailSidebarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expanded, setExpanded] = useState(false);

  const desc = hotel.description || "";
  const short = desc.length > 120 ? desc.slice(0, 120) + "…" : desc;

  const openInGoogleMaps = () => {
    if (!hotel.coordinates) return;

    const { lat, lng } = hotel.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-80 shrink-0 bg-[#0d0d0d] border border-[#1a1a1a] flex flex-col self-start sticky top-8">
      {/* Main Image */}
      <div className="relative h-52 overflow-hidden bg-[#111]">
        {hotel.images[0] ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#2a2a2a] text-[10px] uppercase tracking-widest">
              No Image
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[#c9a96e] text-[9px] uppercase tracking-widest mb-1">
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

      {/* Tabs */}
      <div className="flex border-b border-[#1a1a1a]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-[10px] uppercase tracking-widest py-3 transition-colors ${
              activeTab === tab.id
                ? "text-[#c9a96e] border-b border-[#c9a96e]"
                : "text-[#3a3a3a] hover:text-[#6b7280]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 flex-1">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            {/* About */}
            <div>
              <p className="text-[#c9a96e] text-[9px] uppercase tracking-widest mb-2">
                About
              </p>
              <p className="text-[#6b7280] text-xs leading-relaxed">
                {expanded ? desc : short}
                {desc.length > 120 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-1 text-[#c9a96e] uppercase text-[10px] tracking-widest"
                  >
                    {expanded ? "Less" : "More"}
                  </button>
                )}
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-[#c9a96e] text-[9px] uppercase tracking-widest mb-3">
                Location
              </p>

              {hotel.coordinates ? (
                <>
                  <div className="h-36 w-full overflow-hidden border border-[#1a1a1a] mb-2">
                    <HotelMap
                      lat={hotel.coordinates.lat}
                      lng={hotel.coordinates.lng}
                      hotelName={hotel.name}
                      location={hotel.location}
                    />
                  </div>

                  {/* Open in Google Maps */}
                  <button
                    onClick={openInGoogleMaps}
                    className="text-[10px] uppercase tracking-widest text-[#c9a96e] hover:opacity-70 transition-opacity"
                  >
                    Open in Google Maps →
                  </button>
                </>
              ) : (
                <div className="h-28 bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
                  <p className="text-[#3a3a3a] text-[9px] uppercase tracking-widest">
                    Location unavailable
                  </p>
                </div>
              )}

              <div className="mt-3 text-[#4b5563] text-[11px] flex items-center gap-1">
                <MapPin size={12} className="text-[#c9a96e]" />
                {hotel.location}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Now */}
      <div className="p-5 border-t border-[#1a1a1a]">
        <button
          onClick={() => router.push(`/user/booking?hotelId=${hotel.id}`)}
          className="w-full bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
