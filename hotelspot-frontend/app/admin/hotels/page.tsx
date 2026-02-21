import Link from "next/link";
import { handleGetAllHotels } from "@/lib/actions/admin/hotel-action";
import HotelCards from "./_components/HotelCard";

export default async function Page() {
  const response = await handleGetAllHotels("1", "100");

  if (!response.success) {
    throw new Error(response.message || "Failed to load hotels");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'Rethink Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "3rem 3rem 2.5rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              color: "#c9a96e",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: "0 0 0.75rem",
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "'Georgia', serif",
            }}
          >
            Hotels
          </h1>
        </div>
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
            display: "inline-block",
          }}
        >
          + Create Hotel
        </Link>
      </div>
      <HotelCards hotels={response.data || []} />
    </div>
  );
}
