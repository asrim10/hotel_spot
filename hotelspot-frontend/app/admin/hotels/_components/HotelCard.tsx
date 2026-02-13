"use client";

import { useState } from "react";
import { handleDeleteHotel } from "@/lib/actions/admin/hotel-action";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteModal from "@/app/_components/DeleteModal";

interface Hotel {
  _id: string;
  hotelName: string;
  address: string;
  city: string;
  country: string;
  rating?: number;
  description?: string;
  price: number;
  availableRooms: number;
  imageUrl?: string;
}

interface HotelCardsProps {
  hotels: Hotel[];
}

export default function HotelCards({ hotels }: HotelCardsProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const openDeleteModal = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedHotel(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHotel) return;

    setDeletingId(selectedHotel._id);
    try {
      const response = await handleDeleteHotel(selectedHotel._id);
      if (response.success) {
        toast.success("Hotel deleted successfully");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to delete hotel");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete hotel");
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hotels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your hotel listings
          </p>
        </div>

        {/* Hotels Grid */}
        {!hotels || hotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No hotels found</p>
            <Link
              href="/admin/hotels/create"
              className="inline-block mt-4 px-4 py-2 bg-foreground text-background rounded-md text-sm font-semibold hover:opacity-90"
            >
              Create your first hotel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="group bg-card rounded-xl overflow-hidden border border-black/10 dark:border-white/15 hover:border-foreground/30 transition-all duration-300"
              >
                {/* Hotel Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {hotel.imageUrl ? (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_API_BASE_URL + hotel.imageUrl
                      }
                      alt={hotel.hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                              <span class="text-muted-foreground text-sm">Image Not Found</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                      <span className="text-muted-foreground text-sm">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                    {hotel.hotelName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {hotel.city}, {hotel.country}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3 truncate">
                    {hotel.address}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-foreground">
                        ${hotel.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /night
                      </span>
                    </div>
                    {hotel.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-sm font-medium text-foreground">
                          {hotel.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground">
                      {hotel.availableRooms} room
                      {hotel.availableRooms !== 1 ? "s" : ""} available
                    </span>
                  </div>
                  {hotel.description && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/hotels/${hotel._id}/edit`}
                      className="flex-1 px-3 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-md text-sm font-medium text-center transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(hotel)}
                      disabled={deletingId === hotel._id}
                      className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === hotel._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {selectedHotel && (
          <DeleteModal
            isOpen={modalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleConfirmDelete}
            title={`Delete ${selectedHotel.hotelName}?`}
            description="Are you sure you want to delete this hotel? This action cannot be undone."
          />
        )}
      </div>
    </div>
  );
}
