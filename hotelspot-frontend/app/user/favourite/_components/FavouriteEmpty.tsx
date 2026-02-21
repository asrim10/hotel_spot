"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

interface FavoriteEmptyStateProps {
  isFiltered: boolean;
}

const COLS = [
  {
    title: "Explore & Discover",
    body: "Browse our curated selection of premium hotels and save the ones that catch your eye.",
  },
  {
    title: "Save Your Picks",
    body: "Heart any hotel to add it here instantly. Your collection lives across all your sessions.",
  },
  {
    title: "Book With Ease",
    body: "Return to your favorites any time and book directly — no searching required.",
  },
];

export function FavoriteEmptyState({ isFiltered }: FavoriteEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="py-24 text-center border-t border-[#1a1a1a]">
        <p className="text-[#2a2a2a] text-[11px] tracking-[0.2em] uppercase mb-3">
          No results
        </p>
        <p className="text-[#3a3a3a] text-sm">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between py-8 border-b border-[#1a1a1a] mb-0">
        <div>
          <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
            Your Collection
          </p>
          <h2
            className="text-white text-3xl font-bold uppercase m-0"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            No Favorites Yet
          </h2>
        </div>
        <Heart size={32} className="text-[#1a1a1a]" />
      </div>
      <div className="grid grid-cols-3 border-t border-l border-[#1a1a1a]">
        {COLS.map(({ title, body }, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border-r border-b border-[#1a1a1a] p-8"
          >
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-4">
              {title}
            </p>
            <p className="text-[#4b5563] text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
      <div className="pt-8 flex justify-start">
        <Link
          href="/user/dashboard"
          className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase px-8 py-3.5 hover:opacity-90 transition-opacity no-underline"
        >
          Explore Hotels
        </Link>
      </div>
    </div>
  );
}
