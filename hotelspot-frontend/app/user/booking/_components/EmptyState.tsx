import { Calendar } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-100">
        No bookings found
      </h3>
      <p className="text-gray-300">Try adjusting your search or filters</p>
    </div>
  );
}
