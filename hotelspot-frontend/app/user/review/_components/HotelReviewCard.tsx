import { Stars } from "./Stars";

interface ReviewData {
  _id?: string;
  id?: string;
  userId?: { fullName?: string; email?: string };
  rating: number;
  comment: string;
  createdAt?: string;
}

export function HotelReviewCard({ review }: { review: ReviewData }) {
  const name = review.userId?.fullName || review.userId?.email || "Guest";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="border-t border-[#1f1f1f] py-10 grid grid-cols-[1fr_2fr] gap-12">
      <div className="flex flex-col gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-[#c9a96e] text-sm font-bold">
          {initials}
        </div>
        <p className="text-white text-sm font-semibold m-0">{name}</p>
        <Stars value={review.rating} size={14} />
        <p className="text-[#4b5563] text-xs m-0">{date}</p>
      </div>
      <div>
        <p className="text-[#9ca3af] text-sm leading-relaxed m-0">
          {review.comment}
        </p>
      </div>
    </div>
  );
}
