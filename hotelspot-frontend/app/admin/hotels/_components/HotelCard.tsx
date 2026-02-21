"use client";

import { useState } from "react";
import { handleDeleteHotel } from "@/lib/actions/admin/hotel-action";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, BedDouble, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

function ConfirmModal({
  hotel,
  onClose,
  onConfirm,
}: {
  hotel: Hotel;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{
          position: "relative",
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          width: "90%",
          maxWidth: 420,
          padding: "2rem",
          fontFamily: "'Rethink Sans', sans-serif",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <X size={16} />
        </button>
        <p
          style={{
            color: "#c9a96e",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
          }}
        >
          Confirm Action
        </p>
        <h3
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            textTransform: "uppercase",
            margin: "0 0 1rem",
          }}
        >
          Delete Hotel
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.7,
            margin: "0 0 2rem",
          }}
        >
          Are you sure you want to delete{" "}
          <strong style={{ color: "#fff" }}>{hotel.hotelName}</strong>? This
          action cannot be undone.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#6b7280",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.65rem 1.5rem",
              cursor: "pointer",
              fontFamily: "'Rethink Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "#7f1d1d",
              border: "1px solid #7f1d1d",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.65rem 1.5rem",
              cursor: "pointer",
              fontFamily: "'Rethink Sans', sans-serif",
            }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function HotelCards({ hotels }: { hotels: Hotel[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const handleConfirmDelete = async () => {
    if (!selectedHotel) return;
    setDeletingId(selectedHotel._id);
    try {
      const res = await handleDeleteHotel(selectedHotel._id);
      if (res.success) {
        toast.success("Hotel deleted");
        router.refresh();
      } else toast.error(res.message || "Failed to delete hotel");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete hotel");
    } finally {
      setDeletingId(null);
      setSelectedHotel(null);
    }
  };

  if (!hotels || hotels.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "8rem 0",
          borderTop: "1px solid #1a1a1a",
          fontFamily: "'Rethink Sans', sans-serif",
        }}
      >
        <p
          style={{
            color: "#2a2a2a",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 2rem",
          }}
        >
          No hotels found
        </p>
        <Link
          href="/admin/hotels/create"
          style={{
            background: "#c9a96e",
            color: "#0a0a0a",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "0.85rem 2rem",
            textDecoration: "none",
          }}
        >
          + Create First Hotel
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2.5rem 3rem 4rem",
        fontFamily: "'Rethink Sans', sans-serif",
      }}
    >
      <p
        style={{
          color: "#3a3a3a",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 1.5rem",
        }}
      >
        {hotels.length} {hotels.length === 1 ? "property" : "properties"}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 1,
          borderTop: "1px solid #1a1a1a",
          borderLeft: "1px solid #1a1a1a",
        }}
      >
        {hotels.map((hotel, i) => (
          <motion.div
            key={hotel._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              background: "#0d0d0d",
              borderRight: "1px solid #1a1a1a",
              borderBottom: "1px solid #1a1a1a",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                height: 180,
                overflow: "hidden",
                background: "#111",
                flexShrink: 0,
              }}
            >
              {hotel.imageUrl ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_BASE_URL + hotel.imageUrl}
                  alt={hotel.hotelName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s",
                    display: "block",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#2a2a2a",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    No Image
                  </p>
                </div>
              )}
              {hotel.rating !== undefined && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(10,10,10,0.9)",
                    border: "1px solid #2a2a2a",
                    padding: "0.3rem 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Star
                    size={10}
                    style={{ color: "#c9a96e", fill: "#c9a96e" }}
                  />
                  <span
                    style={{ color: "#c9a96e", fontSize: 11, fontWeight: 700 }}
                  >
                    {hotel.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <p
                style={{
                  color: "#c9a96e",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  margin: "0 0 0.4rem",
                }}
              >
                {hotel.city}, {hotel.country}
              </p>
              <h3
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  margin: "0 0 0.4rem",
                  fontFamily: "'Georgia', serif",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hotel.hotelName}
              </h3>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: 11,
                  margin: "0 0 0.875rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hotel.address}
              </p>
              {hotel.description && (
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: 11,
                    lineHeight: 1.7,
                    margin: "0 0 1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                >
                  {hotel.description}
                </p>
              )}

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "1rem",
                  borderTop: "1px solid #1a1a1a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 19,
                        fontWeight: 700,
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      Rs. {hotel.price.toLocaleString()}
                    </span>
                    <span
                      style={{ color: "#4b5563", fontSize: 11, marginLeft: 4 }}
                    >
                      /night
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <BedDouble size={11} style={{ color: "#4b5563" }} />
                    <span style={{ color: "#4b5563", fontSize: 11 }}>
                      {hotel.availableRooms} rooms
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/hotels/${hotel._id}/edit`}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      border: "1px solid #2a2a2a",
                      color: "#9ca3af",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.65rem",
                      textDecoration: "none",
                      fontFamily: "'Rethink Sans', sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#c9a96e";
                      (e.currentTarget as HTMLElement).style.color = "#c9a96e";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#2a2a2a";
                      (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                    }}
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    disabled={deletingId === hotel._id}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      background: "none",
                      border: "1px solid #2a2a2a",
                      color: "#9ca3af",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.65rem",
                      cursor:
                        deletingId === hotel._id ? "not-allowed" : "pointer",
                      opacity: deletingId === hotel._id ? 0.5 : 1,
                      fontFamily: "'Rethink Sans', sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== hotel._id) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#f87171";
                        (e.currentTarget as HTMLElement).style.color =
                          "#f87171";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#2a2a2a";
                      (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                    }}
                  >
                    <Trash2 size={11} />{" "}
                    {deletingId === hotel._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedHotel && (
          <ConfirmModal
            hotel={selectedHotel}
            onClose={() => setSelectedHotel(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
