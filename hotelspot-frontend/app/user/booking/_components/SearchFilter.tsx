"use client";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <Search
          size={13}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
        />
        <input
          type="text"
          placeholder="Search by hotel name, location, or booking ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white text-xs px-4 py-3 pl-9 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]"
        />
      </div>
      <button className="flex items-center gap-2 border border-[#2a2a2a] text-[#6b7280] text-[10px] tracking-[0.16em] uppercase px-5 py-3 hover:border-[#3a3a3a] hover:text-[#9ca3af] transition-colors bg-transparent cursor-pointer">
        <SlidersHorizontal size={13} />
        Filters
      </button>
    </div>
  );
}
