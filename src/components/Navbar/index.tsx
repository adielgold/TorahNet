"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  MessageSquare,
  User,
  LayoutDashboard,
  History,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  HelpCircle,
  Search,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { StreamChat } from "stream-chat";
import MessagingSidebar from "../Chat/MessagingSidebar";
import Image from "next/image";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/profile/dashboard" },
  { icon: History, label: "Session History", href: "/profile/session-history" },
  // {
  //   icon: CreditCard,
  //   label: "Payment History",
  //   href: "/profile/payment-history",
  // },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
];

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const supabase = createClient();

  const { setUser, user } = useUserStore();

  const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  );

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center border-b bg-white px-4 py-4 lg:px-6">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] bg-[#1e1e4a] p-0 text-white sm:w-[300px]"
          >
            {pathname === "/chat" ? (
              <MessagingSidebar isMobile />
            ) : (
              <nav className="mt-10 flex flex-col gap-1 p-4">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[#2a2a5a] ${
                      pathname === item.href ? "bg-[#2a2a5a]" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/logout"
                  className="mt-4 flex items-center gap-2 rounded-md px-2 py-2 text-red-400 hover:bg-[#2a2a5a] hover:text-red-300"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Link>
              </nav>
            )}
          </SheetContent>
        </Sheet>
        <nav className="mx-auto flex items-center space-x-3 lg:space-x-3">
          <Link
            href="/"
            className="absolute left-[58px] top-[21px] flex items-center space-x-2 md:left-4 md:top-3"
          >
            <Image
              src={"/static/logo.jpg"}
              width={60}
              height={60}
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="hidden text-lg font-bold text-darkblueui sm:inline-block">
              Torah Net
            </span>
          </Link>
          <div className="flex-1" />
          <Link
            href="/profile/dashboard"
            className={`flex items-center space-x-2 rounded-full px-3 py-2 text-gray-600 ${
              pathname?.startsWith("/profile")
                ? "bg-blueui text-white"
                : "hover:text-bg-blueui"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline-block">Home</span>
          </Link>
          {user?.role === "student" && (
            <Link
              href="/search"
              className={`flex items-center space-x-2 rounded-full px-3 py-2 text-gray-600 ${
                pathname?.startsWith("/search")
                  ? "bg-blueui text-white"
                  : "hover:text-bg-blueui"
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline-block">Search</span>
            </Link>
          )}

          {/* <Link
            href="/library"
            className="flex items-center space-x-2 text-gray-600 py-2 px-3 rounded-full hover:text-primary-blue"
          >
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:inline-block">Library</span>
          </Link> */}
          <Link
            href="/chat"
            className={`flex items-center space-x-2 rounded-full px-3 py-2 text-gray-600 ${
              pathname?.startsWith("/chat")
                ? "bg-blueui text-white"
                : "hover:text-bg-blueui"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden sm:inline-block">Chat</span>
          </Link>
        </nav>
        {/* <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-gray-600 hover:text-primary-blue"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button> */}
      </header>
      <div className="flex flex-1">
        {pathname === "/chat" ? (
          <MessagingSidebar />
        ) : pathname?.includes("/search") ? null : (
          <aside className="hidden w-64 bg-[#1e1e4a] text-white lg:block">
            <nav className="flex flex-col gap-1 p-4">
              <div className="mb-4 text-lg font-semibold">Profile</div>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-5 py-2 hover:bg-[#2a2a5a] ${
                    pathname === item.href ? "bg-[#2a2a5a]" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <div
                className="mt-4 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-red-400 hover:bg-[#2a2a5a] hover:text-red-300"
                onClick={async () => {
                  await supabase.auth.signOut();
                  client?.disconnectUser();
                  setUser(null);
                  router.push("/");
                }}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </div>
            </nav>
          </aside>
        )}

        <main
          className={`flex-1 overflow-y-auto bg-gray-50 ${
            pathname === "/chat" ? "p-0" : "p-6"
          }`}
        >
          {children}
          {/* Your main content goes here */}
        </main>
      </div>
    </div>
  );
}
