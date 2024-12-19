import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { SlBookOpen } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { BiConversation } from "react-icons/bi";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useUserStore } from "@/stores/userStore";

const Navbar = () => {
  const router = useRouter();

  const isActive = (href: string) => router.pathname.startsWith(href);

  const navItem = (
    href: string,
    Icon: any,
    label: string,
    iconClass: string
  ) => (
    <Link href={href}>
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 sm:hover:bg-blue-500 rounded-full sm:hover:text-white sm:outerdivclass ${
          isActive(href)
            ? "sm:bg-blue-500 sm:text-white font-bold sm:font-medium text-darkblueui underline underline-offset-8 sm:no-underline"
            : "text-gray-500"
        }`}
      >
        <Icon
          className={`sm:text-2xl text-xl sm:hover:fill-white ${
            isActive(href) ? "search-icon-active text-darkblueui" : iconClass
          }`}
        />
        <span className="sm:text-sm text-xs mt-1 sm:mt-0">{label}</span>
      </div>
    </Link>
  );

  const { user } = useUserStore();

  return (
    <div className="flex w-full min-h-[7vh] sm:justify-between sm:items-center justify-center sm:shadow shadowmobile px-6 sm:px-0">
      <div></div>
      <div className="hidden sm:flex space-x-10">
        {user?.role === "student" &&
          navItem("/search", IoIosSearch, "Search", "search-icon")}
        {navItem("/library", SlBookOpen, "Library", "search-icon")}
        {navItem("/profile/dashboard", FaUser, "Profile", "search-icon")}
        {navItem("/chat", BiConversation, "Chat", "search-icon")}
      </div>
      <div className="flex sm:hidden justify-between w-full">
        {user?.role === "student" &&
          navItem("/search", IoIosSearch, "Search", "search-icon")}

        {navItem("/library", SlBookOpen, "Library", "icon-phone")}
        {navItem("/profile/dashboard", FaUser, "Profile", "icon-phone")}
        {navItem("/chat", BiConversation, "Chat", "icon-phone")}
      </div>
      <button className="px-3.5 py-1.5 rounded-full bg-blueui hidden sm:flex justify-center items-center mt-4 hover:bg-dark mr-6">
        <FaRegCircleQuestion className="text-sm mt-0.5 question-icon" />
        <span className="text-sm text-white ml-1 font-light">Help</span>
      </button>
    </div>
  );
};

export default Navbar;
