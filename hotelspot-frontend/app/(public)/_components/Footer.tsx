import { MapPin, Phone, Mail, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative w-full bg-[#1a1f25] pt-16 pb-8 scroll-mt-28"
    >
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-yellow-500 flex items-center justify-center bg-yellow-500/10">
              <span className="text-yellow-500 text-2xl font-serif font-bold">
                H
              </span>
            </div>
            <h3 className="text-white text-xl font-serif tracking-wider">
              HOTELSPOT
            </h3>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Subscribe */}
          <div>
            <h3 className="text-white text-xl font-serif mb-6">
              Subscribe To Receive <br />
              Latest Offers
            </h3>

            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full bg-[#252b33] text-white/70 px-5 py-3 pr-28 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 rounded-full text-sm transition">
                SUBSCRIBE
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full border border-white/20 hover:border-yellow-500 flex items-center justify-center text-white hover:text-yellow-500 transition">
                f
              </button>
              <button className="w-10 h-10 rounded-full border border-white/20 hover:border-yellow-500 flex items-center justify-center text-white hover:text-yellow-500 transition">
                𝕏
              </button>
              <button className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-black transition">
                in
              </button>
              <button className="w-10 h-10 rounded-full border border-white/20 hover:border-yellow-500 flex items-center justify-center text-white hover:text-yellow-500 transition">
                ▶
              </button>
              <button className="w-10 h-10 rounded-full border border-white/20 hover:border-yellow-500 flex items-center justify-center text-white hover:text-yellow-500 transition">
                📷
              </button>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white text-lg font-serif mb-6">Useful Link</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Featured Rooms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Our Best Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Request a Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white text-lg font-serif mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Client Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Neighborhood
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-yellow-500 text-sm flex items-center gap-2 transition"
                >
                  → Resort Passeirer
                </a>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="text-white text-lg font-serif mb-6">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-yellow-500" size={18} />
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  789 Inner Lane, Holy park,
                  <br />
                  California, USA
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-yellow-500" size={18} />
                </div>
                <div className="text-white/60 text-sm">
                  <p>+01 234 567 890</p>
                  <p>+09 876 543 210</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-yellow-500" size={18} />
                </div>
                <div className="text-white/60 text-sm">
                  <p>mailinfo@hotelspot.com</p>
                  <p>support24@hotelspot.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            Copyright © 2024 Hotelspot. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-yellow-500 transition">
              Terms of service
            </a>
            <span>|</span>
            <a href="#" className="hover:text-yellow-500 transition">
              Privacy policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-yellow-500 transition">
              Cookies
            </a>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="px-3 py-1 bg-white/5 rounded text-white/70 text-xs">
              Apple Pay
            </div>
            <div className="px-3 py-1 bg-white/5 rounded text-white/70 text-xs">
              Mastercard
            </div>
            <div className="px-3 py-1 bg-white/5 rounded text-white/70 text-xs">
              Google Pay
            </div>
            <div className="px-3 py-1 bg-white/5 rounded text-white/70 text-xs">
              PayPal
            </div>
            <div className="px-3 py-1 bg-white/5 rounded text-white/70 text-xs">
              Visa
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
