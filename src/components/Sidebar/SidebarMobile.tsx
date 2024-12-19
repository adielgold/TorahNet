import React from "react";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter

type SidebarMobileProps = {
  title: string;
  href: string; // Add a href prop to link to different pages
};

const SidebarMobile = ({ title, href }: SidebarMobileProps) => {
  const router = useRouter(); // Use useRouter to get the current route

  // Determine the styles based on the current route

  return (
    <div
      className={`flex w-full hover:bg-blueui hover:text-bold font-semibold hover:font-bold`}
    >
      <div className="ml-6 w-full flex min-h-16 justify-start items-center ">
        <div className="bg-[#D7E3F4] w-8 h-8 rounded-full"></div>
        <Link href={href} className="ml-3">
          <span className="text-md ">{title}</span>
        </Link>
      </div>
    </div>
  );
};

export default SidebarMobile;
