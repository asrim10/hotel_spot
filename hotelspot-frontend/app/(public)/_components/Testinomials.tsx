"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = {
  id: number;
  category: string;
  title: string;
  message: string;
  name: string;
  role: string;
  avatar: string;
  image: string;
  rating: number;
};

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    category: "LUXURIOUS HOTEL",
    title: "Amazing Experience",
    message:
      "We loved our stay at Hotelspot! The room was spotless, the staff were incredibly attentive, and the view from our balcony was breathtaking. Everything felt premium and comfortable.",
    name: "Andrew Simon",
    role: "Travel Blogger",
    avatar: "/images/user1.jpg",
    image: "/images/testimonial1.jpg",
    rating: 5,
  },
  {
    id: 2,
    category: "FULLY RELAXATION",
    title: "Perfect Vacation Spot",
    message:
      "Hotelspot is the definition of luxury and peace. The environment was calm, food was delicious, and the service was quick. It truly felt like a second home with a premium touch.",
    name: "Michel John",
    role: "Property Expert",
    avatar: "/images/user2.jpg",
    image: "/images/testimonial2.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1,
    );
  };

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
        {testimonialsData.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              className={`relative w-full h-[420px] overflow-hidden transition-all duration-500 ${
                isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
              }`}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />

              {/* Overlay Card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[90%] bg-black/70 backdrop-blur-md border border-white/10 p-8 flex">
                  {/* Gold Side Strip */}
                  <div className="w-16 flex items-center justify-center bg-yellow-500">
                    <p className="text-black font-semibold tracking-widest rotate-[-90deg] text-sm">
                      {item.category}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-8">
                    {/* Stars */}
                    <div className="flex gap-1 text-yellow-500 mb-4">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={18} fill="gold" stroke="gold" />
                      ))}
                    </div>

                    {/* Message */}
                    <p className="text-white/80 text-sm leading-relaxed">
                      "{item.message}"
                    </p>

                    <div className="w-full h-[1px] bg-white/20 my-6" />

                    {/* User */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-yellow-500">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="text-white font-serif text-lg">
                          {item.name}
                        </h3>
                        <p className="text-white/60 text-sm">{item.role}</p>
                      </div>
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
        {/* Left Arrow */}
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
              width: `${((activeIndex + 1) / testimonialsData.length) * 100}%`,
            }}
          />
        </div>

        {/* Right Arrow */}
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
