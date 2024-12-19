import React from "react";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { StreamChat } from "stream-chat";

type SidebarProps = {
  title: string;
  href: string; // Add a href prop to link to different pages
  logoutLink?: boolean;
};

const SidebarCard = ({ title, href, logoutLink }: SidebarProps) => {
  const router = useRouter(); // Use useRouter to get the current route

  // Determine the styles based on the current route
  const styles =
    router.pathname === href ||
    (router.pathname === "/" &&
      (href === "/profile/dashboard" ||
        href === "/profile/settings" ||
        href === "/chat"))
      ? "bg-white text-[#181849] font-bold"
      : "text-white";

  const supabase = createClient();

  const { setUser } = useUserStore();

  const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!
  );

  return (
    <>
      {logoutLink ? (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            client?.disconnectUser();
            setUser(null);
            router.push("/");
          }}
          className={`flex w-full hover:bg-white hover:text-[#181849] font-semibold hover:font-bold ${styles}`}
        >
          <div className="ml-6 w-full flex min-h-16 justify-start items-center ">
            <div className="bg-[#D7E3F4] w-8 h-8 rounded-full"></div>
            <span className="ml-3">
              <span className="text-md ">{title}</span>
            </span>
          </div>
        </button>
      ) : (
        <div
          className={`flex w-full hover:bg-white hover:text-[#181849] font-semibold hover:font-bold ${styles}`}
        >
          <div className="ml-6 w-full flex min-h-16 justify-start items-center ">
            <div className="bg-[#D7E3F4] w-8 h-8 rounded-full"></div>
            <Link href={href} className="ml-3">
              <span className="text-md ">{title}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarCard;
