import React, { useState } from "react";
import { Sidebar, SidebarSlider } from "@/components";

const HamburgerDashboard = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="flex items-center justify-between pt-4">
      <nav>
        <section className="MOBILE-MENU flex">
          <div
            className="HAMBURGER-ICON space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
          >
            <span className="block h-0.5 w-6 bg-gray-500"></span>
            <span className="block h-0.5 w-6 bg-gray-500"></span>
            <span className="block h-0.5 w-6 bg-gray-500"></span>
          </div>

          {isNavOpen ? (
            <SidebarSlider setIsNavOpen={setIsNavOpen} />
          ) : (
            <div className="hideMenuNav"></div>
          )}
        </section>

        {isNavOpen ? (
          <SidebarSlider setIsNavOpen={setIsNavOpen} />
        ) : (
          <div className="hideMenuNav"></div>
        )}
      </nav>
    </div>
  );
};

export default HamburgerDashboard;
