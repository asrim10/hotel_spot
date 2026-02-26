"use client";

import { motion } from "framer-motion";

export default function HotelsHero({ total }: { total: number }) {
  return (
    <div
      className="relative flex items-end overflow-hidden border-b border-[#1a1a1a]"
      style={{ height: "40vh", minHeight: 300 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0d1117 0%, #1a1a0f 40%, #0f0f0f 100%)",
        }}
      />
      {/* decorative dots */}
      {[
        { top: "25%", left: "15%" },
        { top: "55%", left: "40%" },
        { top: "20%", right: "25%" },
        { top: "65%", right: "12%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white opacity-40"
          style={{ ...pos, boxShadow: "0 0 16px 4px rgba(255,255,255,0.2)" }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.4) 60%, transparent 100%)",
        }}
      />
      <div className="absolute top-[30%] right-[8%] text-right">
        <p className="text-[#c9a96e] text-[10px] tracking-[0.2em] uppercase mb-2">
          Discover
        </p>
        <p className="text-white text-2xl font-light tracking-[0.05em] leading-snug m-0">
          LUXURY
          <br />
          STAYS
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-12 pb-12"
      >
        <p className="text-[#c9a96e] text-[9px] tracking-[0.22em] uppercase mb-3">
          Our Collection
        </p>
        <h1
          className="text-white font-bold uppercase leading-tight m-0"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          ALL HOTELS
        </h1>
        {total > 0 && (
          <p className="text-[#4b5563] text-sm mt-3">{total} Hotel available</p>
        )}
      </motion.div>
    </div>
  );
}
