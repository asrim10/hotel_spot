"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main id="home" className="relative min-h-screen w-full overflow-hidden ">
      {/* Background image*/}
      <Image
        src="/images/hotel1.jpg"
        alt="Luxury Hotel"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full border border-yellow-500 flex items-center justify-center text-white font-bold text-xl">
            H
          </div>

          <p className="text-white font-semibold tracking-wide mt-2">
            HOTEL SPOT
          </p>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <p className="text-sm text-white/80 tracking-widest uppercase">
            Best Prices Guaranteed
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-white font-serif text-4xl md:text-6xl leading-tight drop-shadow-lg">
          Stay in Luxury <br /> Hotels & Rooms
        </h1>

        {/* Room Preview Circles */}
        <div className="absolute bottom-28 flex items-center gap-6">
          {/* Circle 01 */}
          <div className="w-20 h-20 rounded-full border-2 border-yellow-500 overflow-hidden flex items-center justify-center">
            <Image
              src="/images/hotel1.jpg"
              alt="Room 1"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Circle 02 */}
          <div className="relative w-20 h-20 rounded-full border border-white/30 overflow-hidden flex items-center justify-center opacity-70 hover:opacity-100 transition">
            <Image
              src="/images/hotel2.jpg"
              alt="Room 2"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
            <span className="absolute text-white font-semibold text-lg">
              02
            </span>
          </div>

          {/* Circle 03 */}
          <div className="relative w-20 h-20 rounded-full border border-white/30 overflow-hidden flex items-center justify-center opacity-70 hover:opacity-100 transition">
            <Image
              src="/images/hotel3.jpg"
              alt="Room 3"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
            <span className="absolute text-white font-semibold text-lg">
              03
            </span>
          </div>
        </div>
      </div>
      {/* Bottom Gold Wave Border */}
      <div className="absolute bottom-0 w-full">
        <svg
          viewBox="0 0 1440 150"
          className="w-full h-[140px]"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(0,0,0,0.85)"
            d="M0,80 C360,150 1080,0 1440,70 L1440,150 L0,150 Z"
          />
          <path
            fill="none"
            stroke="#d4af37"
            strokeWidth="4"
            d="M0,80 C360,150 1080,0 1440,70"
          />
        </svg>
      </div>
    </main>
  );
}
