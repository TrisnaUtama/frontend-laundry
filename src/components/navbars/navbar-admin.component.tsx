"use client";

import { useState, useEffect } from "react";
import { primaryColor, strokes, hoverPrimaryColor } from "@/constants/constant";
import Link from "next/link";
import { User, Sidebar } from "lucide-react";

export default function NavbarAdmin({
  handler,
  isOpen,
}: {
  handler: () => void;
  isOpen: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

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
      className={`fixed top-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        left: isOpen ? "20%" : "8%",
        width: isOpen ? "80%" : "92%",
      }}
    >
      <div
        className={`flex justify-between items-center border-b border-b-[${strokes}] h-18 w-full bg-white p-6`}
      >
        <Sidebar
          onClick={handler}
          className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors duration-500"
        />

        <Link href="#" className="hover:cursor-pointer">
          <User className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors duration-500" />
        </Link>
      </div>
    </nav>
  );
}
