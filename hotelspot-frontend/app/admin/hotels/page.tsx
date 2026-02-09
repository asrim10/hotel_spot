import Link from "next/link";
import { handleGetAllHotels } from "@/lib/actions/admin/hotel-action";
import HotelCards from "./_components/HotelCard";

export default async function Page() {
  const response = await handleGetAllHotels("1", "100");

  if (!response.success) {
    throw new Error(response.message || "Failed to load hotels");
  }

  return (
    <div>
      <Link
        className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
        href="/admin/hotels/create"
      >
        Create Hotel
      </Link>
      <HotelCards hotels={response.data || []} />
    </div>
  );
}
