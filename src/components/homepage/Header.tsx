"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Upload, Home } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "pt-4" : "pt-6 xl:pt-12"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 xl:px-8" aria-label="Global">
        <div
          className={`flex h-16 items-center justify-between rounded-full bg-white/80 backdrop-blur-sm px-6 relative z-10 ${
            !isMobileMenuOpen ? "shadow-[0_2px_14px_0_rgba(0,0,0,0.15)]" : ""
          }`}
        >
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/unisc_logo.png"
                alt="UniSC Logo"
                width={90}
                height={32}
                className="mr-2"
              />
              <span className="text-xl font-light text-[#262424]">
                CarbonSense
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/analysis"
              className="flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Analyze Data
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`md:hidden -mt-16 rounded-[2rem] bg-white shadow-[0_2px_14px_0_rgba(0,0,0,0.15)] overflow-hidden relative z-0 transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "opacity-100 scale-y-100 pt-16 pb-4 max-h-40"
              : "opacity-0 scale-y-0 max-h-0 pointer-events-none"
          }`}
        >
          <hr className="border-t border-gray-200 mb-3" />
          <div className="flex items-center space-x-8 justify-between px-4">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/analysis"
              className="flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Analyze Data
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
