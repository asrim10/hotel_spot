import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Stars } from "./Stars";
import { handleCreateReview } from "@/lib/actions/review-action";
import { ReviewCreateData } from "@/app/user/review/schema";

interface ReviewModalProps {
  hotelId: string;
  hotelName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  hotelId,
  hotelName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { comment: "" },
  });

  const onSubmit = async (data: any) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const payload: ReviewCreateData = {
      hotelId,
      rating,
      comment: data.comment,
    };
    const result = await handleCreateReview(payload);
    setSubmitting(false);
    if (result.success) {
      toast.success("Review submitted!");
      onSuccess();
      onClose();
    } else toast.error(result.message);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f0f0f",
          border: "1px solid #1f1f1f",
          maxWidth: 520,
          width: "100%",
          padding: "3rem",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "none",
            border: "none",
            color: "#4b5563",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ✕
        </button>

        <p
          style={{
            color: "#c9a96e",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
          }}
        >
          Guest Review
        </p>
        <h2
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
          }}
        >
          Rate Your Stay
        </h2>
        <p style={{ color: "#4b5563", fontSize: 13, margin: "0 0 2.5rem" }}>
          {hotelName}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Your Rating
            </p>
            <Stars value={rating} onChange={setRating} size={32} />
          </div>

          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: "0 0 0.5rem",
              }}
            >
              Your Review
            </p>
            <textarea
              {...register("comment", {
                required: "Review is required",
                minLength: { value: 5, message: "Min 5 characters" },
                maxLength: { value: 1000, message: "Max 1000 characters" },
              })}
              rows={5}
              placeholder="Share the details of your stay..."
              style={{
                background: "transparent",
                border: "1px solid #1f1f1f",
                color: "#9ca3af",
                fontSize: 13,
                fontFamily: "inherit",
                lineHeight: 1.8,
                padding: "0.75rem",
                outline: "none",
                resize: "none",
                width: "100%",
              }}
            />
            {errors.comment && (
              <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
                {errors.comment.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#c9a96e",
              border: "none",
              color: "#0a0a0a",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "1rem 2rem",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              alignSelf: "flex-start",
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
