import { useUserStore } from "@/stores/userStore";
import React, { useState } from "react";

import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  Avatar,
  useChannelStateContext,
  Channel,
  Chat,
  useCreateChatClient,
  ChannelList,
  ChannelHeader,
} from "stream-chat-react";
import Navbar from "../Navbar/Navbar";
import SidebarCard from "../Sidebar/SidebarCard";
import { ArrowIconWhite } from "@/Icons";
import { IoArrowBack } from "react-icons/io5";
import SidebarMobile from "../Sidebar/SidebarMobile";
import Image from "next/image";
import "stream-chat-react/dist/css/v2/index.css";
import MessagingSidebar from "./MessagingSidebar";
import MessagingChannelHeader from "./MessagingChannelHeader";
import { Loader } from "lucide-react";
import LayoutWrapper from "../Layout";
import { FaUser } from "react-icons/fa";
import MessagingChannelFooter from "./MessagingChannelFooter";

interface ChatUIProps {
  token: string | null;
}

const ChatUI: React.FC<ChatUIProps> = ({ token }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const { user } = useUserStore();

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    userData: {
      id: user?.id as string,
      name: user?.name as string,
      image: user?.image_url as string,
    },
    tokenOrProvider: token,
  });

  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message: any) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent_id,
      parent: message.parent,
      text: message.text,
    };

    if (sendMessage) {
      sendMessage(updatedMessage);
    }
  };

  if (!client)
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-blue" />
      </div>
    );

  return (
    <Chat client={client} theme="team light">
      <LayoutWrapper>
        <div style={{ display: "flex", width: "100%" }}>
          <div className="min-h-[94vh] w-full">
            <Channel>
              <Window>
                <MessagingChannelHeader />

                <MessageList />
                <MessagingChannelFooter />

                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </LayoutWrapper>
      {/* <section className="flex flex-col w-full min-h-screen">
        <div className="flex-col w-full relative z-30 hidden sm:flex">
          <Navbar />
        </div>
        
          <div className="sm:hidden flex items-end h-full pt-2 pb-2">
            <Navbar />
          </div>
          
        </div>
      </section> */}
    </Chat>
  );
};

export default ChatUI;
