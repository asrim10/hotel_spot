"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getHotelById } from "../../../lib/api/hotel";
import { createBooking } from "../../../lib/api/booking";
import { Heart, MapPin, Star, Waves, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

const inputCls =
  "w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white text-sm px-4 py-3 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]";
const labelCls =
  "block text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-2";

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
        {eyebrow}
      </p>
      <h3
        className="text-white text-2xl font-bold uppercase m-0"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {title}
      </h3>
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    name: "Emily R.",
    text: "Absolutely breathtaking! The views were stunning and the service was impeccable. Can't wait to come back!",
  },
  {
    name: "John D.",
    text: "Great location and fantastic amenities. The pool area was a highlight. Room was clean and comfortable.",
  },
];

const ROOM_OPTIONS = [
  { name: "Deluxe King Room", desc: "1 King Bed, City View", price: 250 },
  {
    name: "Ocean View Suite",
    desc: "1 King Bed, 1 Sofa Bed, Ocean View",
    price: 450,
  },
];

export default function HotelBookingPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams?.get("hotelId") || "";
  const router = useRouter();
  const { user } = useAuth();

  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nights, setNights] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    getHotelById(hotelId)
      .then((res: any) => {
        if (res?.success) setHotel(res.data);
        else setHotel(res);
      })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [hotelId]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setNights(0);
      setTotalPrice(0);
      setTaxes(0);
      return;
    }
    const diff = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    );
    const n = diff > 0 ? diff : 0;
    setNights(n);
    const sub = n * (hotel?.price || 0);
    const t = Math.round(sub * 0.12);
    setTaxes(t);
    setTotalPrice(sub + t);
  }, [checkIn, checkOut, hotel]);

  const todayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const nextDate = (s: string, add = 1) => {
    const d = new Date(s);
    d.setDate(d.getDate() + add);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const handleCheckIn = (v: string) => {
    if (v < todayString()) {
      toast.error("Cannot select past dates for check-in");
      return;
    }
    setCheckIn(v);
    if (checkOut && new Date(checkOut) <= new Date(v)) setCheckOut("");
  };

  const handleCheckOut = (v: string) => {
    if (v < todayString()) {
      toast.error("Cannot select past dates");
      return;
    }
    if (checkIn && new Date(v) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in");
      return;
    }
    setCheckOut(v);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return "/api/placeholder/800/450";
    if (url.startsWith("http")) return url;
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + url;
  };

  const handleBook = async () => {
    if (!hotel) return toast.error("No hotel selected");
    if (!checkIn || !checkOut)
      return toast.error("Please select check-in and check-out dates");
    if (!fullName || !email)
      return toast.error("Please provide your name and email");
    try {
      setSubmitting(true);
      const res = await createBooking({
        hotelId: hotel._id || hotel.id || hotelId,
        fullName,
        email,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
        paymentMethod: "cash",
      });
      if (res?.success) {
        toast.success("Booking created successfully");
        router.push("/user/booking/history");
      } else toast.error(res?.message || "Booking failed");
    } catch (e: any) {
      toast.error(e.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const location = hotel
    ? [hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")
    : "";

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* TOP NAV */}
      <div className="border-b border-[#1a1a1a] px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6b7280] text-[10px] tracking-[0.16em] uppercase bg-transparent border-none cursor-pointer hover:text-[#c9a96e] transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase m-0">
          Hotelspot
        </p>
        <Heart
          size={16}
          className="text-[#3a3a3a] cursor-pointer hover:text-[#c9a96e] transition-colors"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-64 bg-[#0d0d0d] border border-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !hotel && (
        <div className="flex items-center justify-center py-32 text-[#4b5563] text-sm">
          Hotel not found.
        </div>
      )}

      {!loading && hotel && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 380px" }}>
          {/* ── LEFT / MAIN ── */}
          <div className="border-r border-[#1a1a1a] px-12 py-12">
            {/* HERO */}
            <div className="mb-3">
              <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
                {location}
              </p>
              <h1
                className="text-white font-bold uppercase leading-tight m-0"
                style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
              >
                {hotel.hotelName || hotel.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                {hotel.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="text-[#c9a96e] fill-[#c9a96e]" />
                    <span className="text-[#c9a96e] text-sm font-bold">
                      {hotel.rating}
                    </span>
                    {hotel.reviewsCount && (
                      <span className="text-[#4b5563] text-xs">
                        ({hotel.reviewsCount} reviews)
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[#4b5563] text-xs">
                  <MapPin size={11} className="text-[#c9a96e]" />
                  {location}
                </div>
              </div>
            </div>

            {/* IMAGE GALLERY */}
            <div
              className="grid gap-px bg-[#1a1a1a] mb-14"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr",
                gridTemplateRows: "280px",
              }}
            >
              <div className="overflow-hidden bg-[#111]">
                <img
                  src={getImageUrl(hotel.imageUrl)}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden bg-[#111]">
                <img
                  src={getImageUrl(hotel.imageUrl)}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative overflow-hidden bg-[#111]">
                <img
                  src={getImageUrl(hotel.imageUrl)}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 bg-[#0a0a0a]/90 border border-[#2a2a2a] text-[#9ca3af] text-[10px] tracking-[0.14em] uppercase px-4 py-2 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors cursor-pointer">
                  All Photos
                </button>
              </div>
            </div>

            {/* ABOUT */}
            <div className="border-b border-[#1a1a1a] pb-12 mb-12">
              <SectionTitle eyebrow="Overview" title="About This Hotel" />
              <p className="text-[#6b7280] text-sm leading-relaxed">
                {hotel.description || "No description available."}
              </p>
            </div>

            {/* AMENITIES */}
            <div className="border-b border-[#1a1a1a] pb-12 mb-12">
              <SectionTitle eyebrow="Facilities" title="Amenities" />
              <div className="grid grid-cols-2 gap-3">
                {(
                  hotel.amenities || [
                    "Swimming Pool",
                    "Free Wi-Fi",
                    "Free Parking",
                    "Restaurant",
                    "Gym",
                    "Spa",
                  ]
                ).map((a: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[#6b7280] text-sm"
                  >
                    <Waves size={13} className="text-[#c9a96e] shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* LOCATION */}
            <div className="border-b border-[#1a1a1a] pb-12 mb-12">
              <SectionTitle eyebrow="Where We Are" title="Location" />
              <div className="h-52 bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,#c9a96e,#c9a96e 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#c9a96e,#c9a96e 1px,transparent 1px,transparent 40px)",
                  }}
                />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-12 h-12 border border-[#c9a96e]/40 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#c9a96e] rounded-full" />
                  </div>
                  <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase">
                    {location}
                  </p>
                </div>
              </div>
            </div>

            {/* REVIEWS */}
            <div>
              <SectionTitle eyebrow="What Guests Say" title="Guest Reviews" />
              <div className="flex flex-col gap-px bg-[#1a1a1a]">
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className="bg-[#0d0d0d] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#c9a96e] text-xs font-bold">
                        {r.name[0]}
                      </div>
                      <span className="text-white text-sm font-bold">
                        {r.name}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={10}
                            className="text-[#c9a96e] fill-[#c9a96e]"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#6b7280] text-sm leading-relaxed m-0">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
              <button className="text-[#c9a96e] text-[10px] tracking-[0.16em] uppercase mt-5 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity">
                Show all {hotel.reviewsCount ?? ""} reviews →
              </button>
            </div>
          </div>

          {/* ── RIGHT / BOOKING SIDEBAR ── */}
          <div className="sticky top-0 h-screen overflow-y-auto bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col">
            <div className="p-8 border-b border-[#1a1a1a]">
              <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
                Starting from
              </p>
              <p className="text-white text-3xl font-bold m-0">
                Rs. {(hotel.price || 0).toLocaleString()}
                <span className="text-[#4b5563] text-sm font-normal">
                  /night
                </span>
              </p>
            </div>

            <div className="p-8 flex flex-col gap-5 flex-1">
              <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase">
                Reserve Your Stay
              </p>

              <div>
                <label className={labelCls}>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={todayString()}
                  onChange={(e) => handleCheckIn(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn ? nextDate(checkIn) : todayString()}
                  onChange={(e) => handleCheckOut(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className={inputCls}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price breakdown */}
              {nights > 0 && (
                <div className="border-t border-b border-[#1a1a1a] py-5 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4b5563]">
                      Rs. {(hotel.price || 0).toLocaleString()} × {nights}{" "}
                      nights
                    </span>
                    <span className="text-white">
                      Rs. {((hotel.price || 0) * nights).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4b5563]">Taxes & fees (12%)</span>
                    <span className="text-white">
                      Rs. {taxes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-[#c9a96e] text-lg">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
              </div>

              <button
                disabled={submitting || nights <= 0}
                onClick={handleBook}
                className="w-full bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase py-4 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer mt-auto"
              >
                {submitting ? "Booking..." : "Reserve Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
