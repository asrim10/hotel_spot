"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { handleGetPublicReviews } from "@/lib/actions/review-action";

type Review = {
  _id: string;
  fullName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const result = await handleGetPublicReviews();
      if (result.success) {
        setReviews(result.data.slice(0, 6));
      }
    };
    fetchReviews();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  if (reviews.length === 0) return null;

  return (
    <section
      id="feedback"
      className="relative w-full py-24 bg-[#0b0b0b] overflow-hidden scroll-mt-28"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />

      {/* Heading */}
      <div className="relative z-10 text-center mb-16">
        <p className="text-yellow-500 tracking-[5px] text-sm uppercase">
          Testimonials
        </p>
        <h2 className="text-white text-4xl md:text-5xl font-serif mt-3">
          Customer's Feedback
        </h2>
        <div className="w-28 h-[2px] bg-yellow-500 mx-auto mt-4" />
      </div>

      {/* Slider */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {reviews.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item._id}
              className={`relative w-full overflow-hidden transition-all duration-500 ${
                isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
              }`}
            >
              {/* Card */}
              <div className="relative w-full bg-black/70 backdrop-blur-md border border-white/10 p-8 flex">
                {/* Gold Side Strip */}
                <div className="w-16 flex items-center justify-center bg-yellow-500">
                  <p className="text-black font-semibold tracking-widest rotate-[-90deg] text-sm whitespace-nowrap">
                    GUEST REVIEW
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 px-8">
                  {/* Stars */}
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < item.rating ? "gold" : "none"}
                        stroke="gold"
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-white/80 text-sm leading-relaxed">
                    "{item.comment}"
                  </p>

                  <div className="w-full h-[1px] bg-white/20 my-6" />

                  {/* User */}
                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full border border-yellow-500 bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-500 font-serif text-lg font-bold">
                        {item.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-white font-serif text-lg">
                        {item.fullName}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-14 flex items-center">
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
        >
          <ChevronLeft className="text-black" />
        </button>

        {/* Progress Line */}
        <div className="flex-1 h-[2px] bg-white/20 mx-6 relative">
          <div
            className="absolute top-0 left-0 h-[2px] bg-yellow-500 transition-all duration-500"
            style={{
              width: `${((activeIndex + 1) / reviews.length) * 100}%`,
            }}
          />
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-yellow-500 transition"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </section>
  );
}
