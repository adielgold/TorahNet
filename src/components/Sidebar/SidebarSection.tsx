import React from "react";
import SidebarCard from "./SidebarCard";
import { PROFILE_SIDEBAR } from "../../constants/constant";

const Sidebar = () => {
  return (
    <section className="flex flex-col min-w-[250px] max-w-[250px] bg-[#181849] min-h-dvh">
      <h2 className="text-white text-2xl font-bold mt-4 ml-6">Profile</h2>
      <div className="flex flex-col w-full mt-5">
        <SidebarCard title="Dashboard" href="/profile/dashboard" />
        <SidebarCard title="Session History" href="/profile/session-history" />
        <SidebarCard title="Payment History" href="/profile/payment-history" />
        <SidebarCard title="Settings" href="/profile/settings" />
        <SidebarCard title="Sign Out" href="/" logoutLink />
      </div>
    </section>
  );
};

export default Sidebar;
