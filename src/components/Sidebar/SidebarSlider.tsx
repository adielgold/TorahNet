import React from "react";
import SidebarCard from "./SidebarCard";
import { IoArrowBack } from "react-icons/io5";

interface SidebarSliderProps {
  setIsNavOpen: (isOpen: boolean) => void;
}

const SidebarSlider: React.FC<SidebarSliderProps> = ({ setIsNavOpen }) => {
  return (
    <section className="w-3/4 bg-[#181849] min-h-screen absolute inset-0 h-screen z-10 flex flex-col py-4">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-white text-2xl font-bold mt-4 ml-6">Profile</h2>
        <IoArrowBack
          className="text-white text-4xl mt-2 mr-4"
          onClick={() => setIsNavOpen(false)}
        />
      </div>
      <div className="flex flex-col w-full mt-5">
        <SidebarCard title="Dashboard" href="/profile/dashboard" />
        <SidebarCard title="Session History" href="/profile/session-history" />
        <SidebarCard title="Payment History" href="/profile/payment-history" />
        <SidebarCard title="Settings" href="/profile/settings" />
        <SidebarCard title="Sign Out" href="/" />
      </div>
    </section>
  );
};

export default SidebarSlider;
