"use client";

import { useState, useEffect } from "react";
import { primaryColor, strokes, hoverPrimaryColor } from "@/constants/constant";
import Link from "next/link";
import { Button } from "../ui/button";
import { WashingMachineIcon, Menu } from "lucide-react";

export default function NavbarUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen, lastScrollPos]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`flex justify-between items-center border-b border-b-[${strokes}] h-16 w-full bg-white p-5 relative`}
      >
        {/* Logo Section */}
        <div className="ms-3">
          <p className={`text-[${primaryColor}] font-bold text-lg`}>
            LaundryHub
          </p>
        </div>

        {/* Links Section */}
        <div className="hidden md:flex space-x-5">
          <Link href="#" className="font-semibold">
            Home
          </Link>
          <Link href="#" className="font-semibold">
            Services
          </Link>
          <Link href="#" className="font-semibold">
            About Us
          </Link>
          <Link href="#" className="font-semibold">
            FAQ
          </Link>
          <Link href="#" className="font-semibold">
            Contact
          </Link>
        </div>

        {/* Actions Section */}
        <div className="hidden md:flex justify-between items-center gap-4">
          <Link href="#" className="hover:cursor-pointer">
            <WashingMachineIcon className="w-10" />
          </Link>
          <Button
            className={`bg-[${primaryColor}] hover:bg-[${hoverPrimaryColor}] rounded-xl shadow-none`}
          >
            Schedule a Pick Up
          </Button>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <Button
            onClick={toggleMenu}
            className="text-gray-600 bg-white hover:bg-gray-200 transition-all duration-300"
          >
            <Menu
              className={`w-6 h-6 transition-transform duration-300 ${
                isMenuOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-white shadow-md z-10 
        flex flex-col items-center space-y-4 p-4
        transition-all duration-500 ease-in-out
        origin-top overflow-hidden
        ${
          isMenuOpen
            ? "opacity-100 max-h-[400px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link
            href="#"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="#"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="#"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <Link href="#" className="hover:cursor-pointer">
              <WashingMachineIcon className="w-8" />
            </Link>
            <Button
              className={`bg-[${primaryColor}] hover:bg-[${hoverPrimaryColor}] rounded-xl shadow-none`}
            >
              Schedule a Pick Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
