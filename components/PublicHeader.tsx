"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="flex-shrink-0">
          <Image
            src={logo}
            alt="2days Ventures"
            className="h-12 sm:h-14 md:h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}