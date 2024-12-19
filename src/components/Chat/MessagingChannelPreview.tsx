import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChannelListContext,
  useChatContext,
} from "stream-chat-react";

import { useEffect, type MouseEventHandler } from "react";
import type { Channel, ChannelMemberResponse } from "stream-chat";
import { useRouter } from "next/router";
import { useUserStore } from "@/stores/userStore";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";

const getTimeStamp = (channel: Channel) => {
  let lastHours = channel.state.last_message_at?.getHours();
  let lastMinutes: string | number | undefined =
    channel.state.last_message_at?.getMinutes();
  let half = "AM";

  if (lastHours === undefined || lastMinutes === undefined) {
    return "";
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = "PM";
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = "PM";

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getChannelName = (members: ChannelMemberResponse[]) => {
  const defaultName = "Johnny Blaze";

  if (!members.length || members.length === 1) {
    return members[0]?.user?.name || defaultName;
  }

  return `${members[0]?.user?.name || defaultName}, ${
    members[1]?.user?.name || defaultName
  }`;
};

type MessagingChannelPreviewProps = ChannelPreviewUIComponentProps & {
  channel: Channel;
  setActiveChannel?: ChatContextValue["setActiveChannel"];
};

const MessagingChannelPreview = (props: MessagingChannelPreviewProps) => {
  const { channel, setActiveChannel, latestMessage } = props;
  const { channel: activeChannel, client } = useChatContext();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID
  );

  const { user: storeUser } = useUserStore();

  const router = useRouter();

  const { channels } = useChannelListContext();

  console.log(channels?.[0], "Channels");

  // useEffect(() => {
  //   if (router?.query?.channel) {
  //     const channelModified = channels.map((chn) => {
  //       const channelMembers = Object.values(chn.state.members);

  //       console.log(channelMembers, "Channel Members");
  //       return {
  //         ...chn,
  //         state: {
  //           ...chn.state,
  //           members: channelMembers,
  //         },
  //       };
  //     });

  //     const findedChannel = channelModified.find((ch) => {
  //       return ch.state.members.some(
  //         (member) => member.user?.id === router.query.channel
  //       );
  //     });

  //     console.log(findedChannel, "Finded Channel");

  //     const usersObject = findedChannel?.state.members.reduce((acc, user) => {
  //       //@ts-ignore
  //       acc[user.user_id] = user;
  //       return acc;
  //     }, {});

  //     const modifyFindedChannelBackToNormal = {
  //       ...findedChannel,
  //       state: {
  //         ...findedChannel?.state,
  //         members: usersObject,
  //       },
  //     };

  //     console.log(modifyFindedChannelBackToNormal, "Modify Finded Channel");

  //     setActiveChannel?.(modifyFindedChannelBackToNormal as Channel);
  //   }
  // }, [router.query.channel]);

  useEffect(() => {
    if (router?.query?.channel) {
      const findedChannel = channels.find((ch) => {
        const channelMembers = Object.values(ch.state.members);
        console.log(channelMembers, "Channel Members");
        return channelMembers.some(
          (member) => member.user?.id === router.query.channel
        );
      });

      if (findedChannel) {
        console.log(findedChannel, "Finded Channel");

        // Use the original findedChannel object when setting the active channel
        setActiveChannel?.(findedChannel);
      }
    }
  }, [router.query.channel, channels]);

  return (
    <div
      onClick={(e) => {
        // onClick(e);
        router.push(`/chat?channel=${members[0]?.user?.id}`, undefined, {
          shallow: true,
        });
        setActiveChannel?.(channel);
      }}
      className={`flex items-center p-3 hover:bg-[#2a2a5a] cursor-pointer transition-colors duration-200 ${
        channel?.id === activeChannel?.id
          ? "bg-white text-black"
          : "bg-transparent text-white"
      }`}
    >
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage
          src={members[0]?.user?.image}
          alt={members[0]?.user?.name}
        />
        <AvatarFallback>{members[0]?.user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold  truncate text-sm">
            {members[0]?.user?.name}
          </h3>
          <span className="text-xs  ml-2 flex-shrink-0">
            {getTimeStamp(channel)}
          </span>
        </div>
        <p className="text-xs  truncate">{latestMessage}</p>
      </div>
    </div>
  );
};

export default MessagingChannelPreview;
