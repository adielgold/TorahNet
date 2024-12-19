import { useEffect, type MouseEventHandler } from "react";
import {
  ChannelList,
  ChannelListProps,
  useChannelListContext,
} from "stream-chat-react";
import MessagingChannelPreview from "./MessagingChannelPreview";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";

type MessagingSidebarProps = {
  isMobile?: boolean;
};

const MessagingSidebar = ({ isMobile }: MessagingSidebarProps) => {
  const { user: storeUser } = useUserStore();

  return (
    <>
      {isMobile ? (
        <>
          <h2 className="text-2xl font-bold text-white p-4">Chat</h2>
          <ScrollArea className="flex-grow">
            <ChannelList
              sort={{
                last_message_at: -1,
              }}
              filters={{
                members: { $in: [storeUser?.id!] },
                type: "messaging",
              }}
              options={{
                state: true,
                presence: true,
              }}
              Preview={(props) => {
                // @ts-ignore
                return <MessagingChannelPreview {...props} />;
              }}
            />
          </ScrollArea>
        </>
      ) : (
        <div className="str-chat w-64 hidden lg:block   min-h-[93vh] bg-[#181849] ">
          <h2 className="text-2xl font-bold text-white p-4">Chat</h2>
          <ScrollArea className="flex-grow">
            <ChannelList
              sort={{
                last_message_at: -1,
              }}
              filters={{
                members: { $in: [storeUser?.id!] },
                type: "messaging",
              }}
              options={{
                state: true,
                presence: true,
              }}
              Preview={(props) => {
                // @ts-ignore
                return <MessagingChannelPreview {...props} />;
              }}
            />
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default MessagingSidebar;
