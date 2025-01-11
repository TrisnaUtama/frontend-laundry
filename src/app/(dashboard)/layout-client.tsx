"use client";

import NavbarUser from "@/components/navbars/navbar-user.component";
import SidebarAdmin from "@/components/sidebar/admin-sidebar";
import Footer from "@/components/footer/footer";
import NavbarAdmin from "@/components/navbars/navbar-admin.component";
import { useState } from "react";

export default function DashboardLayoutClient({
  children,
  role,
  user_id,
}: {
  children: React.ReactNode;
  role: string;
  user_id: string;
}) {
  const [handlerSidebar, setHandler] = useState(false);
  const toggleSidebar = () => {
    setHandler((handler) => !handler);
  };
  return (
    <>
      {role === "User" ? (
        <>
          <div className="relative min-h-screen">
            <div className="fixed top-0 left-0 w-full z-50">
              <NavbarUser user_id={user_id} />
            </div>

            <main className="pt-16 pb-20">{children}</main>

            <Footer handler={false} />
          </div>
        </>
      ) : (
        <>
          <div className="fixed top-0 left-0 h-screen w-1/5 z-50">
            <SidebarAdmin role={role} isOpen={handlerSidebar} />
          </div>

          <div className="fixed top-0 z-50">
            <NavbarAdmin
              user_id={user_id}
              handler={toggleSidebar}
              isOpen={handlerSidebar}
            />
          </div>
          <main
            className={`relative transition-all duration-300 ease-in-out  ${
              handlerSidebar ? "left-[20%] w-[80%]" : "left-[8%] w-[92%]"
            } `}
          >
            {children}
          </main>
          <div className="fixed top-0 z-10 ">
            <Footer handler={handlerSidebar} />
          </div>
        </>
      )}
    </>
  );
}
