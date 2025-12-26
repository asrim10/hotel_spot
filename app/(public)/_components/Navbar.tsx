"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />

          <div className="flex-1 flex items-center justify-center">
            <div className="text-white font-serif text-2xl tracking-widest">
              Hotelspot
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            <Link
              href="/login"
              className="text-white border border-white/30 px-4 py-2 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100"
            >
              Sign in / Sign up
            </Link>
          </div>
        </div>

        <nav className="mt-4">
          <ul className="flex flex-wrap justify-center gap-8 text-white text-sm">
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Hotels &amp; Resorts
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Offers
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Experiences
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Meetings &amp; Celebrations
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              About us
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              ALL Accor Loyalty
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Magazine
            </li>
            <li className="px-2 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white/100 cursor-pointer">
              Sofitel Boutique
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
