"use client";

interface PopularHotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
}

export default function PopularHotelCard({
  id,
  name,
  location,
  price,
  image,
}: PopularHotelCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <span className="text-emerald-500">📍</span>
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="text-orange-500 font-bold text-lg">
          $ {price.toFixed(2)}{" "}
          <span className="text-sm text-gray-500 font-normal">/night</span>
        </div>
      </div>
    </div>
  );
}
