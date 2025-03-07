import { ArrowIconWhite } from "@/Icons";
import { MeetingDialog, Navbar, SidebarMobile } from "@/components";
import SidebarCard from "@/components/Sidebar/SidebarCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Chat as StrChat,
  Thread,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import ChatUI from "@/components/Chat/ChatUI";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";

const Chat = () => {
  const [token, setToken] = useState<string | null>("");

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log(error, "Error getting session");
        return;
      }

      const { data: axiosData } = await axios.get("/api/getStreamToken");

      setToken(axiosData?.token as string);
    })();
  }, []);

  if (!token)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-blue" />
      </div>
    );

  return <ChatUI token={token} />;
};

export default Chat;
