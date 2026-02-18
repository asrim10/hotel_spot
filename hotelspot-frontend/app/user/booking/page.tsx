"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getHotelById } from "../../../lib/api/hotel";
import { createBooking } from "../../../lib/api/booking";
import { Heart, MapPin, Star, Waves } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function HotelPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams?.get("hotelId") || "";

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nights, setNights] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

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

    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil(
      (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
    );
    const validNights = diff > 0 ? diff : 0;
    setNights(validNights);

    const pricePerNight = hotel?.price || 0;
    const subtotal = validNights * pricePerNight;
    const calcTaxes = Math.round(subtotal * 0.12); // 12% taxes as example
    setTaxes(calcTaxes);
    setTotalPrice(subtotal + calcTaxes);
  }, [checkIn, checkOut, hotel]);

  const todayString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const nextDateString = (dateStr: string, add = 1) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + add);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCheckInChange = (value: string) => {
    const today = todayString();
    if (value < today) {
      toast.error("Cannot select past dates for check-in");
      return;
    }
    setCheckIn(value);
    // If check-out is before or equal to new check-in, clear it
    if (checkOut && new Date(checkOut) <= new Date(value)) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (value: string) => {
    const today = todayString();
    if (value < today) {
      toast.error("Cannot select past dates for check-out");
      return;
    }
    if (checkIn && new Date(value) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in");
      return;
    }
    setCheckOut(value);
  };

  const getImageUrl = (
    imageUrl?: string,
    fallback = "/api/placeholder/800/450",
  ) => {
    if (!imageUrl) return fallback;
    if (imageUrl.startsWith("http")) return imageUrl;
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + imageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Hotelspot</h1>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-700 rounded-full"></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && <div className="text-gray-300">Loading...</div>}

        {!loading && !hotel && (
          <div className="text-red-400">Hotel not found.</div>
        )}

        {!loading && hotel && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="col-span-2 relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={getImageUrl(
                      hotel.imageUrl,
                      "/api/placeholder/800/450",
                    )}
                    alt={hotel.hotelName || hotel.name || "Hotel image"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={getImageUrl(
                      hotel.imageUrl,
                      "/api/placeholder/400/400",
                    )}
                    alt={hotel.hotelName || hotel.name || "Hotel image"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={getImageUrl(
                      hotel.imageUrl,
                      "/api/placeholder/400/400",
                    )}
                    alt={hotel.hotelName || hotel.name || "Hotel image"}
                    className="w-full h-full object-cover"
                  />

                  <button className="absolute bottom-4 right-4 bg-gray-800/80 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
                    <span className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <span className="bg-gray-200 rounded-sm"></span>
                      <span className="bg-gray-200 rounded-sm"></span>
                      <span className="bg-gray-200 rounded-sm"></span>
                      <span className="bg-gray-200 rounded-sm"></span>
                    </span>
                    Show all photos
                  </button>
                </div>
              </div>

              {/* Hotel Info */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3 text-gray-100">
                  {hotel.hotelName || hotel.name}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-100">
                      {hotel.rating ?? "-"}
                    </span>
                    <span>({hotel.reviewsCount ?? "-"} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {hotel.address
                        ? `${hotel.address}${
                            hotel.city ? ", " + hotel.city : ""
                          }${hotel.country ? ", " + hotel.country : ""}`
                        : (hotel.location ?? "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-100">
                  About this hotel
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {hotel.description || "No description available."}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-100">
                  Amenities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    hotel.amenities || [
                      "Swimming Pool",
                      "Free Wi-Fi",
                      "Free Parking",
                    ]
                  ).map((a: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <Waves className="w-5 h-5 text-emerald-400" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Options */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Room Options</h3>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-700 rounded-xl hover:border-gray-600 bg-gray-800">
                    <div className="flex items-center gap-4">
                      <img
                        src="/api/placeholder/80/80"
                        alt="Deluxe King Room"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold mb-1">Deluxe King Room</h4>
                        <p className="text-sm text-gray-300">
                          1 King Bed, City View
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold mb-2">
                        $250{" "}
                        <span className="text-sm font-normal text-gray-400">
                          /night
                        </span>
                      </p>

                      <button className="px-6 py-2 border-2 border-emerald-600 text-emerald-400 rounded-lg font-medium hover:bg-emerald-600 hover:text-white transition">
                        Select
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-700 rounded-xl hover:border-gray-600 bg-gray-800">
                    <div className="flex items-center gap-4">
                      <img
                        src="/api/placeholder/80/80"
                        alt="Ocean View Suite"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold mb-1">Ocean View Suite</h4>
                        <p className="text-sm text-gray-300">
                          1 King Bed, 1 Sofa Bed, Ocean View
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold mb-2">
                        $450{" "}
                        <span className="text-sm font-normal text-gray-400">
                          /night
                        </span>
                      </p>

                      <button className="px-6 py-2 border-2 border-emerald-600 text-emerald-400 rounded-lg font-medium hover:bg-emerald-600 hover:text-white transition">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                  <img
                    src="/api/placeholder/800/450"
                    alt="Map location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Guest Reviews */}
              <div>
                <h3 className="text-xl font-bold mb-4">Guest Reviews</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Emily R.</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm">
                      "Absolutely breathtaking! The views were stunning and the
                      service was impeccable. Can't wait to come back!"
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">John D.</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm">
                      "Great location and fantastic amenities. The pool area was
                      a highlight. Room was clean and comfortable."
                    </p>
                  </div>

                  <button className="text-emerald-400 font-medium hover:underline">
                    Show all {hotel.reviewsCount ?? "reviews"}
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-gray-100">
                  Reserve your stay
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={todayString()}
                      onChange={(e) => handleCheckInChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn ? nextDateString(checkIn) : todayString()}
                      onChange={(e) => handleCheckOutChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      ${hotel?.price ?? 0} × {nights} nights
                    </span>
                    <span className="font-medium text-gray-100">
                      ${(hotel?.price || 0) * nights}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Taxes & fees</span>
                    <span className="font-medium text-gray-100">${taxes}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg text-gray-100">Total</span>
                  <span className="font-bold text-xl text-gray-100">
                    ${totalPrice}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
                  />
                  <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
                  />
                </div>

                <button
                  disabled={submitting || nights <= 0}
                  onClick={async () => {
                    if (!hotel) return toast.error("No hotel selected");
                    if (!checkIn || !checkOut)
                      return toast.error(
                        "Please select check-in and check-out dates",
                      );
                    if (!fullName || !email)
                      return toast.error("Please provide your name and email");

                    const payload = {
                      hotelId: hotel._id || hotel.id || hotelId,
                      fullName,
                      email,
                      checkInDate: checkIn,
                      checkOutDate: checkOut,
                      totalPrice: totalPrice,
                      paymentMethod: "cash",
                    };

                    try {
                      setSubmitting(true);
                      const res = await createBooking(payload);
                      if (res?.success) {
                        toast.success("Booking created successfully");
                        router.push("/dashboard/history");
                      } else {
                        toast.error(res?.message || "Booking failed");
                      }
                    } catch (err: any) {
                      toast.error(err.message || "Booking failed");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? "Booking..." : "Reserve Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
