import { Stars } from "./Stars";

interface ReviewData {
  _id?: string;
  id?: string;
  user?: { name?: string; email?: string };
  userName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export function HotelReviewCard({ review }: { review: ReviewData }) {
  const name = review.user?.name || review.userName || "Guest";
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
    <div
      style={{
        borderTop: "1px solid #1f1f1f",
        padding: "2.5rem 0",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "3rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#1f1f1f",
            border: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#c9a96e",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>
          {name}
        </p>
        <Stars value={review.rating} size={14} />
        <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>{date}</p>
      </div>
      <div>
        <p
          style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.8, margin: 0 }}
        >
          {review.comment}
        </p>
      </div>
    </div>
  );
}
