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
          <Link href="/" className="text-gray-700 hover:text-[#0A1931] font-medium transition-colors">
            Home
          </Link>
          <Link href="/wallet" className="text-gray-700 hover:text-[#0A1931] font-medium transition-colors">
            Wallet
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#0A1931] font-medium transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-[#0A1931] font-medium transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Mobile Wallet Icon */}
          <Link 
            href="/wallet" 
            className="text-gray-700 hover:text-[#0A1931] transition-colors p-1"
            aria-label="Wallet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none p-1"
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
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg absolute w-full left-0">
          <nav className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-[#0A1931] rounded-lg transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-[#0A1931] rounded-lg transition font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block py-3 px-3 text-gray-700 hover:bg-gray-100 hover:text-[#0A1931] rounded-lg transition font-medium"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}