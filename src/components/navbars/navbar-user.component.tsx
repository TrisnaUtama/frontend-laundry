"use client";

import { useState, useEffect } from "react";
import { primaryColor, strokes, hoverPrimaryColor } from "@/constants/constant";
import Link from "next/link";
import { Button } from "../ui/button";
import { WashingMachineIcon, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/logout.services";

export default function NavbarUser({ user_id }: { user_id: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isChoosee, setIsChoosee] = useState("");
  const { toast } = useToast();
  const router = useRouter();

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

  const handleClickNavbar = (section: string) => {
    setIsChoosee(section);
  };

  const handleLogout = async () => {
    try {
      const result = await logout(user_id);

      if (result.status) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message || "Successfully Logout",
        });
        router.push("/auth/sign-in");
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: result.message || "Failed Logout",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: error.message || "Failed Logout",
        });
      }
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Something Wrong while logout",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300  ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`flex justify-between items-center border-b border-b-[${strokes}] h-16 w-full bg-white p-5 relative`}
      >
        {/* Logo Section */}
        <div className="ms-[12%]">
          <p className={`text-[${primaryColor}] font-bold text-2xl`}>
            LaundryHub
          </p>
        </div>

        {/* Links Section */}
        <div className="hidden md:flex space-x-10">
          {["Home", "Services", "About-Us", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLocaleLowerCase().replace("-", " ")}`}
              onClick={() => handleClickNavbar(item)}
              className={`font-semibold relative text-sm transition-all ${
                isChoosee === item
                  ? `text-[${primaryColor}] duration-500 scale-110 after:scale-x-100`
                  : "scale-100 after:scale-x-0"
              } after:content-[''] after:absolute after:shadow-md after:bottom-0 after:left-0 after:w-full after:rounded-lg after:h-[2px] after:bg-blue-500 after:origin-left after:transition-transform after:duration-500`}
            >
              {item.replace("-", " ")}
            </Link>
          ))}
        </div>

        {/* Actions Section */}
        <div className="hidden md:flex justify-between items-center gap-4 me-[12%]">
          <Link href="/dashboard/user/orders" className="hover:cursor-pointer">
            <WashingMachineIcon className="w-10 hover:text-blue-500 hover:transition-colors hover:duration-500 duration-500" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <User className="text-black hover:text-blue-500 transition-colors duration-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-5">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-medium">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-medium"
                onSelect={() => setIsAlertOpen(true)}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-semibold">
                This action will Logout your account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Hamburger Menu */}
        <div className="md:hidden me-[12%]">
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
            href="home"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="services"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="about us"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="contact"
            className="font-semibold hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <Link
              href="/dashboard/user/orders/"
              className="hover:cursor-pointer transition-colors duration-300 hover:text-blue-500"
            >
              <WashingMachineIcon className="w-8" />
            </Link>
            <Link
              href="/dashboard/user/orders/create"
              className={`p-3 transition-colors duration-300 text-white font-medium bg-[${primaryColor}] hover:bg-[${hoverPrimaryColor}] rounded-xl shadow-none`}
            >
              Schedule a Pick Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
