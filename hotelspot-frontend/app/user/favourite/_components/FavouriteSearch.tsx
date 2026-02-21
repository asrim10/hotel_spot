"use client";

import { Search } from "lucide-react";

interface FavoritesSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  count: number;
}

export function FavoritesSearchBar({
  value,
  onChange,
  count,
}: FavoritesSearchBarProps) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] px-6 py-5 flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-60">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
        />
        <input
          type="text"
          placeholder="Search by name or location..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xs px-4 py-2.5 pl-9 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]"
        />
      </div>
      <p className="text-[#3a3a3a] text-[10px] tracking-[0.18em] uppercase">
        {count} {count === 1 ? "property" : "properties"} saved
      </p>
    </div>
  );
}
