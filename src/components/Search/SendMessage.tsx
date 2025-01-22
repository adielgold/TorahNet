import { ArrowIconWhite, LittleStar } from "@/Icons";
import React, { use, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import SeeProfile from "./SeeProfile";
import { SearchUserData, User } from "@/types";
import QuickLinksCard from "../QuickLinks/QuickLinksCard";
import Image from "next/image";
import useConnectStreamClient from "@/hooks/useConnectStreamClient";
import { useForm } from "react-hook-form";
import { Channel, StreamChat } from "stream-chat";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import { Star, X } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import axios from "axios";

interface FormValues {
  message: string;
}

const SendMessage = ({
  name,
  email,
  expertise,
  bio,
  role,
  id,
  topics,
  handleClose,
  image_url,
  avg_rating,
  hourly_rate,
  ratingData,
}: SearchUserData & { handleClose: () => void; ratingData: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const router = useRouter();

  // const handleProfileOpen = () => {
  //   setIsOpen(true);
  // };

  // const handleProfileClose = () => {
  //   setIsOpen(false);
  // };

  const { user } = useUserStore();

  const token = useConnectStreamClient();

  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!token) return;
    (async () => {
      const streamClient = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!
      );
      setClient(streamClient);

      await streamClient.connectUser(
        {
          id: user?.id as string,
          name: user?.name as string,
        },
        token
      );
    })();
  }, [token]);

  useEffect(() => {
    if (!client) return;

    (async () => {
      const filter = {
        type: "messaging",
        id: { $eq: `channel_${user?.id?.slice(0, 15)}--${id?.slice(0, 15)}` },
      };

      const channels = await client.queryChannels(filter, {
        last_message_at: -1,
      });

      if (channels.length > 0) {
        setChannel(channels[0]);
      }
    })();
  }, [client]);

  const onSendMessage = async (data: FormValues) => {
    console.log(data, "Data");

    if (!client) return;

    const newChannel = client.channel(
      "messaging",
      `channel_${user?.id?.slice(0, 15)}--${id?.slice(0, 15)}`,
      {
        members: [user?.id as string, id],
      }
    );

    await newChannel.create();

    newChannel.watch();

    await newChannel.sendMessage({
      text: data?.message,
      user: {
        id: user?.id!,
      },
      show_in_channel: true,
    });

    await axios.post("/api/resend/messagesent", {
      id,
      message: data.message,
    });

    handleClose();

    toast({
      title: "Message Sent",
      description:
        "Message has been sent to Teacher successfully. Check your chat",
    });
  };

  if (!token) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#1e1e4a]">
              <AvatarImage src={image_url!} alt={name!} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-[#1e1e4a]">{name}</h2>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {ratingData?.review_count > 0 ? (
                    <>
                      {ratingData?.average_score?.toFixed(2)}
                      <span className="underline ml-1">
                        ({ratingData?.review_count} reviews)
                      </span>
                    </>
                  ) : (
                    "Not Rated"
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#1e1e4a] mb-2">
            Biography
          </h3>
          <p className="text-gray-600">{bio}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#1e1e4a] mb-2">
            Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {topics?.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#e0e0ff] text-[#1e1e4a]"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div
          className={`flex justify-between  ${
            channel ? "flex-row items-center" : "flex-col gap-4"
          }`}
        >
          <span className="text-xl font-semibold text-[#1e1e4a]">
            ${hourly_rate}/hour
          </span>

          {channel ? (
            <Button
              onClick={() => router.push(`/chat?channel=${channel.cid}`)}
              className="bg-[#1e1e4a] hover:bg-[#2a2a5a] text-white transition-colors duration-300"
            >
              Go to Chat
            </Button>
          ) : (
            <form onSubmit={handleSubmit(onSendMessage)} className="w-full">
              <textarea
                {...register("message", {
                  required: {
                    value: true,
                    message: "Message is required",
                  },
                  minLength: {
                    value: 10,
                    message: "Message should be atleast 10 characters",
                  },
                })}
                className="w-full h-32 border border-[#D7E3F4] rounded-lg p-2"
                placeholder="Type your message here..."
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-2 font-bold">
                  {errors.message.message}
                </p>
              )}
              <div className="flex w-full justify-end mt-5">
                <Button
                  type="submit"
                  className="bg-[#1e1e4a] hover:bg-[#2a2a5a] text-white transition-colors duration-300"
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>

    // <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50 px-4 sm:px-0">
    //   <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
    //   <div className="bg-white w-[48rem] md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
    //     <div className="py-4 text-left sm:px-6 px-4">
    //       <div className="flex sm:flex-row flex-col justify-center items-center">
    //         <div className="w-full sm:hidden flex justify-between">
    //           <div className="sm:w-20 sm:h-20 h-16 w-16 bg-[#D7E3F4] rounded-full justify-center flex items-center relative">
    //             {image_url && (
    //               <Image
    //                 alt="profile image"
    //                 src={image_url}
    //                 className="rounded-full sm:w-20 sm:h-20 h-16 w-16 object-contain"
    //                 layout="fill"
    //               />
    //             )}
    //           </div>
    //           <button
    //             className="bg-[#6893D4] w-28 h-7 rounded-full flex justify-center items-center whitespace-nowrap"
    //             onClick={handleProfileOpen}
    //           >
    //             <FaUser className="mr-2 text-white text-xs" />
    //             <span className="text-white text-xs">View Profile</span>
    //           </button>
    //         </div>
    //         <div className="sm:w-20 sm:h-20 h-16 w-16 bg-[#D7E3F4] rounded-full justify-center hidden sm:flex items-center relative">
    //           {image_url && (
    //             <Image
    //               alt="profile image"
    //               src={image_url}
    //               className="rounded-full sm:w-20 sm:h-20 h-16 w-16 object-contain"
    //               layout="fill"
    //             />
    //           )}
    //         </div>
    //         <div className="flex flex-col sm:ml-5 ml-3 sm:w-3/4 w-full">
    //           <div className="flex sm:justify-between sm:w-full justify-end">
    //             <span className="text-darkblueui text-xl font-bold hover:underline hidden sm:flex">
    //               {name}
    //             </span>
    //             <button
    //               className="bg-[#6893D4] w-28 h-7 rounded-full justify-center items-center whitespace-nowrap hidden sm:flex"
    //               onClick={handleProfileOpen}
    //             >
    //               <FaUser className="mr-2 text-white text-xs" />
    //               <span className="text-white text-xs">View Profile</span>
    //             </button>
    //           </div>
    //           <div className="flex sm:flex-row flex-col mt-2">
    //             <span className="text-darkblueui text-xl font-bold hover:underline sm:hidden flex">
    //               {name}
    //             </span>
    //             <div className="flex items-center">
    //               <Star size={16} className="text-[#FFD700]" />
    //               <p className="ml-1 text-xs text-darkblueui">
    //                 {ratingData?.review_count > 0 ? (
    //                   <>
    //                     {ratingData?.average_score}
    //                     <span className="">
    //                       ({ratingData?.review_count} reviews)
    //                     </span>
    //                   </>
    //                 ) : (
    //                   "Not Rated"
    //                 )}
    //               </p>
    //             </div>
    //           </div>
    //           <div className="flex sm:items-start space-x-2 sm:gap-y-0.5 flex-wrap ">
    //             {topics?.map((topic, ind) => {
    //               return (
    //                 <div
    //                   key={ind}
    //                   className="flex bg-[#d7e3f4] rounded-full justify-center items-center mt-2  text-darkblueui min-w-24 text-[10px] sm:text-xs sm:min-w-28 h-6 px-3"
    //                 >
    //                   {topic}
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       </div>
    //       {channel ? (
    //         <div className="flex w-full justify-end mt-5">
    //           <button className="mr-5" onClick={handleClose}>
    //             <span className="text-darkblueui text-sm underline underline-offset-2">
    //               Cancel
    //             </span>
    //           </button>
    //           <button
    //             onClick={() => router.push(`/chat?channel=${id}`)}
    //             className="bg-darkblueui px-5 h-9 rounded-full flex text-white text-sm items-center"
    //           >
    //             Go to Chat
    //             <ArrowIconWhite />
    //           </button>
    //         </div>
    //       ) : (
    //         <form onSubmit={handleSubmit(onSendMessage)}>
    //           <div className="w-full  mt-4">
    //             <textarea
    //               {...register("message", {
    //                 required: {
    //                   value: true,
    //                   message: "Message is required",
    //                 },
    //                 minLength: {
    //                   value: 10,
    //                   message: "Message should be atleast 10 characters",
    //                 },
    //               })}
    //               className="w-full h-32 border border-[#D7E3F4] rounded-lg p-2"
    //               placeholder="Type your message here..."
    //             ></textarea>
    //             {errors.message && (
    //               <p className="text-red-500 text-xs mt-1">
    //                 {errors.message.message}
    //               </p>
    //             )}
    //           </div>
    //           <div className="flex w-full justify-end mt-5">
    //             <button className="mr-5" onClick={handleClose}>
    //               <span className="text-darkblueui text-sm underline underline-offset-2">
    //                 Cancel
    //               </span>
    //             </button>
    //             <button
    //               type="submit"
    //               className="bg-darkblueui px-5 h-9 rounded-full flex text-white text-sm items-center"
    //             >
    //               Send
    //               <ArrowIconWhite />
    //             </button>
    //           </div>
    //         </form>
    //       )}
    //     </div>
    //   </div>

    // </div>
  );
};

export default SendMessage;
