"use client";

import { primaryColor, strokes } from "@/constants/constant";
import {
  ChevronDown,
  HomeIcon,
  PenTool,
  ChartBarIncreasing,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { type Route, getRoutes } from "@/lib/routes";

export default function SidebarAdmin({
  role,
  isOpen,
}: {
  role: string;
  isOpen: boolean;
}) {
  const [isOpenSection, setIsOpenSection] = useState("");
  const [isSelectItem, setIsSelectItem] = useState("");
  const [groupedRoutes, setGroupedRoutes] = useState<Record<string, Route[]>>(
    {}
  );

  const handleIsOpenSection = (section: string) => {
    setIsOpenSection(isOpenSection === section ? "" : section);
  };

  const handleSelectItem = (item: string) => {
    setIsSelectItem(item);
  };

  useEffect(() => {
    const routes = getRoutes(role);
    const grouped = routes.reduce((acc, route) => {
      if (!acc[route.type]) {
        acc[route.type] = [];
      }
      acc[route.type].push(route);
      return acc;
    }, {} as Record<string, Route[]>);
    setGroupedRoutes(grouped);
  }, [role]);

  return (
    <div
      className={`fixed top-0 h-screen z-50 border-r border-r-[${strokes}] bg-white ${
        isOpen ? "w-[20%]" : "w-[8%]"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-center items-center p-5 space-x-3">
        <div className="flex justify-center items-center p-5 space-x-3">
          <p
            className={`text-[${primaryColor}] font-bold ${
              isOpen
                ? "text-2xl lg:text-xl md:text-lg sm:text-sm"
                : "text-[12px]"
            }`}
          >
            LaundryHub
          </p>
        </div>
      </div>
      <hr className={`bg-[${strokes}] ${isOpen && "mx-5"}`} />

      <div>
        {Object.keys(groupedRoutes).map((type) => (
          <div key={type}>
            {isOpen ? (
              <div className="flex justify-between items-center mt-5">
                <p className="mx-5 font-bold capitalize">{type}</p>
                <Button
                  className="bg-transparent hover:bg-white shadow-none"
                  onClick={() => handleIsOpenSection(type)}
                >
                  <ChevronDown
                    className={`me-2 duration-500 transition-transform text-black w-5 ${
                      isOpenSection === type ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleIsOpenSection(type)}
                className="m-5 bg-transparent shadow-transparent hover:bg-transparent text-black hover:text-blue-600"
              >
                {type === "Overview" ? (
                  <HomeIcon className=" w-7 h-7 transition-colors duration-300" />
                ) : type === "Bussines" ? (
                  <PenTool className="  w-7 h-7  transition-colors duration-300" />
                ) : type === "People Management" ? (
                  <User className="  w-7 h-7 transition-colors duration-300" />
                ) : (
                  <ChartBarIncreasing className=" w-7 h-7  transition-colors duration-300" />
                )}
              </Button>
            )}
            <div
              className={`mx-8 mt-3 font-semibold text-sm overflow-hidden transition-all duration-500 ${
                isOpenSection === type
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {groupedRoutes[type].map((route) => (
                <div
                  key={route.menu}
                  className={`hover:bg-gray-50  transition-colors duration-500 hover:text-blue-500 rounded-xl flex justify-center items-center p-3 ${
                    isSelectItem === route.menu && "bg-gray-100 rounded-xl"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <route.icon
                        className={`hover:bg-50 w-5 h-5  mr-2  ${
                          isSelectItem === route.menu && "text-blue-500"
                        }`}
                      />
                      <Link
                        href={route.pathname}
                        onClick={() => handleSelectItem(route.menu)}
                        className={`p-3 w-full hover:text-blue-500 text-black transition-colors duration-500 ${
                          isSelectItem === route.menu && "text-blue-500"
                        }`}
                      >
                        {route.menu}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={route.pathname}
                        className="hover:text-blue-500"
                      >
                        <route.icon
                          className={`text-gray-500 hover:text-blue-500 transition-colors duration-500 ${
                            isSelectItem === route.menu && "text-blue-500"
                          }`}
                        />
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
