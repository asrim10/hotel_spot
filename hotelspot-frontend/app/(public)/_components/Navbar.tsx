"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Hotelspot Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Center Logo Text */}
          <div className="text-white font-serif text-2xl tracking-widest">
            Hotelspot
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white border border-white/30 px-4 py-2 rounded-md transition-all duration-200 hover:bg-white hover:text-black"
            >
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setOpenMenu(!openMenu)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block mt-4">
          <ul className="flex justify-center gap-10 text-white text-sm font-medium tracking-wide">
            <li>
              <Link
                href="#home"
                className="px-2 py-1 rounded-md transition-colors duration-200 hover:text-yellow-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="px-2 py-1 rounded-md transition-colors duration-200 hover:text-yellow-400"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="#facilities"
                className="px-2 py-1 rounded-md transition-colors duration-200 hover:text-yellow-400"
              >
                Facilities
              </Link>
            </li>
            <li>
              <Link
                href="#feedback"
                className="px-2 py-1 rounded-md transition-colors duration-200 hover:text-yellow-400"
              >
                Experiences
              </Link>
            </li>

            <li>
              <Link
                href="#contact"
                className="px-2 py-1 rounded-md transition-colors duration-200 hover:text-yellow-400"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu */}
        {openMenu && (
          <div className="md:hidden mt-4 bg-black/90 rounded-xl p-4">
            <ul className="flex flex-col gap-4 text-white text-sm">
              <li>
                <Link
                  href="#home"
                  className="block hover:text-yellow-400"
                  onClick={() => setOpenMenu(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="block hover:text-yellow-400"
                  onClick={() => setOpenMenu(false)}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#facilities"
                  className="block hover:text-yellow-400"
                  onClick={() => setOpenMenu(false)}
                >
                  Facilities
                </Link>
              </li>
              <li>
                <Link
                  href="#feedback"
                  className="block hover:text-yellow-400"
                  onClick={() => setOpenMenu(false)}
                >
                  Experiences
                </Link>
              </li>

              <li>
                <Link
                  href="#contact"
                  className="block hover:text-yellow-400"
                  onClick={() => setOpenMenu(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
