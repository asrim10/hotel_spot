import { MapPin, Phone, Mail, Building2 } from "lucide-react";
import { FaApple, FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative w-full bg-[#1a1f25] pt-16 pb-8 scroll-mt-28"
    >
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
              Our links <br />
            </h3>

            <div className="flex gap-3">
              {[
                {
                  icon: <FaFacebookF size={14} />,
                  href: "https://facebook.com",
                  className:
                    "border border-white/20 hover:border-yellow-500 text-white hover:text-yellow-500",
                },
                {
                  icon: <FaXTwitter size={14} />,
                  href: "https://x.com",
                  className:
                    "border border-white/20 hover:border-yellow-500 text-white hover:text-yellow-500",
                },
                {
                  icon: <FaLinkedinIn size={14} />,
                  href: "https://linkedin.com",
                  className: "bg-yellow-500 hover:bg-yellow-600 text-black",
                },
                {
                  icon: <FaYoutube size={14} />,
                  href: "https://youtube.com",
                  className:
                    "border border-white/20 hover:border-yellow-500 text-white hover:text-yellow-500",
                },
                {
                  icon: <FaInstagram size={14} />,
                  href: "https://instagram.com",
                  className:
                    "border border-white/20 hover:border-yellow-500 text-white hover:text-yellow-500",
                },
              ].map(({ icon, href, className }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${className}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white text-lg font-serif mb-6">Useful Link</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
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
                  href="#feedback"
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
                  Changunarayan-3, Bhaktapur
                  <br />
                  Nepal
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-yellow-500" size={18} />
                </div>
                <div className="text-white/60 text-sm">
                  <p>+977-9863039493</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-yellow-500" size={18} />
                </div>
                <div className="text-white/60 text-sm">
                  <p>asrimsuwal7@gmail.com</p>
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
            {[
              {
                label: "Apple Pay",
                icon: <FaApple size={14} />,
                href: "https://www.apple.com/apple-pay/",
              },
              {
                label: "Mastercard",
                icon: <FaCcMastercard size={14} />,
                href: "https://www.mastercard.com",
              },
              {
                label: "Google Pay",
                icon: <SiGooglepay size={14} />,
                href: "https://pay.google.com",
              },
              {
                label: "PayPal",
                icon: <FaCcPaypal size={14} />,
                href: "https://www.paypal.com",
              },
              {
                label: "Visa",
                icon: <FaCcVisa size={14} />,
                href: "https://www.visa.com",
              },
            ].map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded text-white/70 text-xs hover:bg-white/10 hover:text-white transition"
              >
                {icon} {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
