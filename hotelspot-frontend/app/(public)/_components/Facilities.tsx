"use client";

import Image from "next/image";
import { JSX, useState } from "react";

import {
  Wifi,
  Car,
  BedDouble,
  Waves,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

type Facility = {
  id: number;
  title: string;
  icon: JSX.Element;
  bgImage?: string;
};

const facilitiesData: Facility[] = [
  {
    id: 1,
    title: "Free Wifi Internet",
    icon: <Wifi size={40} className="text-white" />,
  },
  {
    id: 2,
    title: "Free Parking",
    icon: <Car size={40} className="text-white" />,
  },
  {
    id: 3,
    title: "Room Services",
    icon: <BedDouble size={40} className="text-white" />,
  },
  {
    id: 4,
    title: "Swimming Pool",
    icon: <Waves size={40} className="text-white" />,
  },
  {
    id: 5,
    title: "Fitness & Wellbeing",
    icon: <Dumbbell size={40} className="text-white" />,
  },
];

export default function Facilities() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? facilitiesData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === facilitiesData.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section
      id="facilities"
      className="relative w-full h-[650px] overflow-hidden"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-[2px] bg-yellow-500" />
            <div className="w-9 h-9 rounded-full border border-yellow-500 flex items-center justify-center text-white font-semibold">
              H
            </div>
            <div className="w-10 h-[2px] bg-yellow-500" />
          </div>

          <h2 className="text-white text-4xl font-serif tracking-wide">
            Facilities
          </h2>

          <div className="w-24 h-[2px] bg-yellow-500 mx-auto mt-4" />
        </div>

        {/* Facilities Slider */}
        <div className="flex items-center justify-center gap-10 w-full max-w-6xl">
          {facilitiesData.map((facility, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={facility.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveIndex(index)}
              >
                {/* Circle */}
                <div
                  className={`relative flex items-center justify-center w-28 h-28 rounded-full border border-white/20 
                  transition-all duration-300
                  ${isActive ? "scale-110 border-yellow-500" : "opacity-80"}`}
                >
                  {/* Active Background Image */}
                  {isActive && facility.bgImage && (
                    <Image
                      src={facility.bgImage}
                      alt={facility.title}
                      fill
                      className="object-cover rounded-full opacity-60"
                    />
                  )}

                  {/* Inner overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/60" />

                  {/* Icon */}
                  <div className="relative z-10">{facility.icon}</div>
                </div>

                {/* Text */}
                <p
                  className={`mt-4 text-sm font-medium tracking-wide transition-all duration-300
                  ${isActive ? "text-yellow-400" : "text-white/80"}`}
                >
                  {facility.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Line + Arrows */}
        <div className="relative flex items-center w-full max-w-6xl mt-14">
          {/* Left Button */}
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
          >
            <ChevronLeft className="text-black" />
          </button>

          {/* Line */}
          <div className="flex-1 h-[2px] bg-white/20 mx-6 relative">
            <div
              className="absolute top-0 left-0 h-[2px] bg-yellow-500 transition-all duration-500"
              style={{
                width: `${((activeIndex + 1) / facilitiesData.length) * 100}%`,
              }}
            />
          </div>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 hover:border-yellow-500 transition"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>

        {/* Play Button */}
        <div className="absolute bottom-12">
          <button className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center hover:scale-110 transition">
            <Play className="text-white" size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}
