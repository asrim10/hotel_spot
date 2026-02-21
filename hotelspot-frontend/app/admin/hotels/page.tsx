import Link from "next/link";
import { handleGetAllHotels } from "@/lib/actions/admin/hotel-action";
import HotelCards from "./_components/HotelCard";

export default async function Page() {
  const response = await handleGetAllHotels("1", "100");

  if (!response.success) {
    throw new Error(response.message || "Failed to load hotels");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-[Rethink_Sans]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap'); * { font-family: 'Rethink Sans', sans-serif; }`}</style>
      <div className="border-b border-[#1a1a1a] px-12 py-12 flex items-end justify-between">
        <div>
          <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
            Admin Panel
          </p>
          <h1
            className="text-white font-bold uppercase leading-tight m-0 text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Hotels
          </h1>
        </div>
        <Link
          href="/admin/hotels/create"
          className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase px-8 py-3.5 hover:opacity-90 transition-opacity no-underline"
        >
          + Create Hotel
        </Link>
      </div>
      <HotelCards hotels={response.data || []} />
    </div>
  );
}
