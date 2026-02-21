"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { handleGetReviewsByHotel } from "@/lib/actions/review-action";
import { getHotelById } from "@/lib/api/hotel";
import { getImageUrl } from "@/app/BookingUtils";
import { HotelReviewCard } from "./_components/HotelReviewCard";
import { ReviewModal } from "./_components/ReviewModal";
import { Stars } from "./_components/Stars";

interface HotelData {
  _id?: string;
  hotelName?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  price?: number;
  rating?: number;
  imageUrl?: string;
  availableRooms?: number;
}

interface ReviewData {
  _id?: string;
  id?: string;

  userId?: {
    _id?: string;
    fullName?: string;
    email?: string;
  };

  rating: number;
  comment: string;
  createdAt?: string;
}

export default function HotelReviewsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [hotelId, setHotelId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("hotelId");
    if (id) setHotelId(id);
  }, [searchParams]);

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchReviews = async () => {
    if (!hotelId) return;
    const result = await handleGetReviewsByHotel(hotelId);
    if (result.success)
      setReviews(Array.isArray(result.data) ? result.data : []);
  };

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    Promise.all([
      getHotelById(hotelId)
        .then((res: any) => {
          const data = res?.success ? res.data : res;
          if (data) setHotel(data);
        })
        .catch(() => {}),
      fetchReviews(),
    ]).finally(() => setLoading(false));
  }, [hotelId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const imageUrl = getImageUrl(hotel?.imageUrl);
  const location = [hotel?.address, hotel?.city, hotel?.country]
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "#4b5563",
            fontFamily: "Georgia, serif",
            fontSize: 14,
            letterSpacing: "0.1em",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  // fallback when hotelId is missing
  if (!hotelId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#c9a96e", marginBottom: 16 }}>
            No Hotel Selected
          </h2>
          <p style={{ color: "#aaa" }}>
            Please select a hotel to view reviews.
          </p>
        </div>
      </div>
    );
  }

  // fallback for hotel not found
  if (!hotel) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#c9a96e", marginBottom: 16 }}>
            Hotel Not Found
          </h2>
          <p style={{ color: "#aaa" }}>
            The selected hotel does not exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/*  HERO  */}
      <div
        style={{
          position: "relative",
          height: "65vh",
          minHeight: 450,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={hotel?.hotelName}
            onError={() => setImgError(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #0d1117 0%, #1a1a0f 40%, #0f0f0f 100%)",
            }}
          />
        )}
        {[
          { top: "30%", left: "20%" },
          { top: "55%", left: "60%" },
          { top: "20%", right: "25%" },
          { top: "65%", right: "10%" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...(pos as any),
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.5,
              boxShadow: "0 0 16px 4px rgba(255,255,255,0.25)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.15) 100%)",
          }}
        />

        {/* Top-right rating */}
        {avgRating && (
          <div
            style={{
              position: "absolute",
              top: "2rem",
              right: "5%",
              textAlign: "right",
            }}
          >
            <p
              style={{
                color: "#c9a96e",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 0.5rem",
              }}
            >
              Guest Rating
            </p>
            <p
              style={{
                color: "#fff",
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1,
                margin: "0 0 0.5rem",
              }}
            >
              {avgRating}
            </p>
            <Stars value={Math.round(Number(avgRating))} size={16} />
            <p style={{ color: "#6b7280", fontSize: 12, marginTop: 6 }}>
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Bottom-left */}
        <div
          style={{ position: "relative", zIndex: 1, padding: "0 5% 3.5rem" }}
        >
          <p
            style={{
              color: "#c9a96e",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 0.75rem",
            }}
          >
            {location || "Hotel Reviews"}
          </p>
          <h1
            style={{
              fontSize: "clamp(28px,5vw,64px)",
              fontWeight: 700,
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: "0 0 1.5rem",
            }}
          >
            {hotel?.hotelName || "Hotel"}
          </h1>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#c9a96e",
                border: "none",
                color: "#0a0a0a",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "0.9rem 2rem",
                cursor: "pointer",
              }}
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/*  HOTEL DETAILS BAR  */}
      {hotel && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            borderTop: "1px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          {[
            {
              label: "Price Per Night",
              value: hotel.price ? `Rs. ${hotel.price.toLocaleString()}` : "—",
            },
            { label: "Available Rooms", value: hotel.availableRooms ?? "—" },
            { label: "Total Reviews", value: reviews.length },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "2rem 5%",
                borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <p
                style={{
                  color: "#c9a96e",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  margin: "0 0 0.5rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/*  DESCRIPTION  */}
      {hotel?.description && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "3rem",
            padding: "4rem 5%",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <p
            style={{
              color: "#c9a96e",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            About This Hotel
          </p>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 15,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {hotel.description}
          </p>
        </div>
      )}

      {/*  REVIEWS  */}
      <div style={{ padding: "4rem 5%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p
              style={{
                color: "#c9a96e",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "0 0 1rem",
              }}
            >
              What Guests Say
            </p>
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(24px,4vw,48px)",
                fontWeight: 700,
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              GUEST REVIEWS
            </h2>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#c9a96e",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
              }}
            >
              + Add Review
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 0,
              borderTop: "1px solid #1a1a1a",
            }}
          >
            {["Be The First", "Your Voice Matters", "Help Fellow Guests"].map(
              (title, i) => (
                <div
                  key={i}
                  style={{
                    padding: "2.5rem 2rem 2.5rem 0",
                    borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
                    paddingLeft: i > 0 ? "2rem" : 0,
                  }}
                >
                  <p
                    style={{
                      color: "#c9a96e",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "1rem",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7 }}
                  >
                    {
                      [
                        "No reviews yet. Share your experience and help others discover this property.",
                        "Your honest feedback directly improves future stays for every guest who follows.",
                        "Rate the amenities, service, and overall experience to guide fellow travelers.",
                      ][i]
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <div>
            {reviews.map((r) => (
              <HotelReviewCard key={r._id || r.id} review={r} />
            ))}
          </div>
        )}
      </div>

      {showModal && hotel && (
        <ReviewModal
          hotelId={hotelId!}
          hotelName={hotel.hotelName || "Hotel"}
          onClose={() => setShowModal(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
}
