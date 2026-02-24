"use client";
import { handleInitiateKhaltiPayment } from "@/lib/actions/payment-action";
import { useState } from "react";

interface Props {
  bookingId: string;
  totalPrice: number;
  fullName: string;
  email: string;
}

export default function KhaltiPayButton({
  bookingId,
  totalPrice,
  fullName,
  email,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const data = await handleInitiateKhaltiPayment({
        bookingId,
        totalPrice,
        fullName,
        email,
      });

      if (data.success && data.data?.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        alert(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay with Khalti"}
    </button>
  );
}
