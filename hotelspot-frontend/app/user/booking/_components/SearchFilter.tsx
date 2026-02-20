import { Search, Filter } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
}: SearchFilterBarProps) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by hotel name, location, or booking ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-700">
          <Filter className="w-5 h-5 text-gray-100" />
          <span className="font-medium text-gray-100">Filters</span>
        </button>
      </div>
    </div>
  );
}
