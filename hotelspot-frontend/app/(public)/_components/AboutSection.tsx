import Image from "next/image";
import {
  Sparkles,
  Luggage,
  BedDouble,
  CarTaxiFront,
  ArrowRight,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full py-24 bg-[#0b0b0b] overflow-hidden scroll-mt-28"
    >
      <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat" />

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="text-white">
          {/* Heading */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-yellow-500 flex items-center justify-center font-semibold">
                H
              </div>

              <div>
                <h2 className="text-4xl font-serif text-white">
                  About{" "}
                  <span className="text-yellow-500 font-semibold">
                    Hotelspot
                  </span>
                </h2>

                <div className="w-28 h-[2px] bg-yellow-500 mt-2" />
              </div>
            </div>
          </div>

          {/* Paragraph */}
          <p className="text-white/70 leading-relaxed text-sm">
            Hotelspot is passionate about creating unforgettable experiences and
            understands that little things make a huge difference for our
            guests. We deliver premium comfort, luxury service, and world-class
            hospitality.
            <br />
            <br />
            From cozy luxury rooms to breathtaking city views, our goal is to
            make every stay feel like your second home.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            <div>
              <h3 className="text-yellow-500 text-3xl font-serif">50+</h3>
              <p className="text-white/70 text-sm mt-1">Luxury Hotels</p>
            </div>

            <div>
              <h3 className="text-yellow-500 text-3xl font-serif">4.8+</h3>
              <p className="text-white/70 text-sm mt-1">Guest Rating</p>
            </div>

            <div>
              <h3 className="text-yellow-500 text-3xl font-serif">128k+</h3>
              <p className="text-white/70 text-sm mt-1">Clients Happy</p>
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="relative flex justify-center">
          {/* Oval Image */}
          <div className="relative w-[320px] h-[520px] rounded-[200px] overflow-hidden border-4 border-yellow-500/50">
            <Image
              src="/images/about.jpg"
              alt="Hotelspot About"
              fill
              className="object-cover"
            />
          </div>

          {/* Circular Curved Text */}
          <div className="absolute -top-10 -left-10 w-[450px] h-[450px] pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                id="circlePath"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill="none"
              />
              <text
                dy="-10"
                className="text-[13px] fill-white/70 tracking-[0.3em] uppercase font-light"
              >
                <textPath href="#circlePath">Welcome to Hotelspot</textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* RIGHT SIDE FEATURES */}
        <div className="flex flex-col gap-10 text-white">
          {/* Feature Item */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full border border-yellow-500/40 flex items-center justify-center">
              <Sparkles className="text-yellow-500" size={28} />
            </div>

            <div>
              <h3 className="text-xl font-serif">Serenity and Bliss</h3>
              <p className="text-white/60 text-sm mt-1">
                Your comfort zone away from home
              </p>
            </div>
          </div>

          {/* Feature Item */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full border border-yellow-500/40 flex items-center justify-center">
              <Luggage className="text-yellow-500" size={28} />
            </div>

            <div>
              <h3 className="text-xl font-serif">Store Luggage</h3>
              <p className="text-white/60 text-sm mt-1">
                Hospitality meets comfort & security
              </p>
            </div>
          </div>

          {/* Feature Item */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full border border-yellow-500/40 flex items-center justify-center">
              <BedDouble className="text-yellow-500" size={28} />
            </div>

            <div>
              <h3 className="text-xl font-serif">Room Services</h3>
              <p className="text-white/60 text-sm mt-1">
                Premium service at your doorstep
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
