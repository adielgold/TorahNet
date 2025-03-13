import { ArrowIconWhite } from "@/Icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa6";
import {
  Avatar,
  useChannelListContext,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { DateTimePickerForm } from "../TimePicker/DateTimePicker";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "../ui/use-toast";
import { SessionWithUsers } from "@/types";
import { Calendar, Clock, Download } from "lucide-react";
import { shouldShowJoinButton } from "@/lib/utils";
import { useRouter } from "next/router";
import { useStreamClient } from "@/context/StreamVideoClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";
import { capturePaypalPayment } from "@/lib/capturePaypalPayment";
import ToasterTitle from "../ui/toaster-title";

const MessagingChannelHeader: React.FC = () => {
  const { client } = useChatContext();
  const { channel } = useChannelStateContext();

  const members = Object.values(channel.state.members).filter(
    (member) => member.user?.id !== client?.user?.id,
  );

  return (
    <div className="flex min-h-[80px] items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <Avatar
          name={members?.[0]?.user?.name}
          image={members?.[0]?.user?.image}
          size={50}
          user={members?.[0]?.user}
        />
        <div>
          <p className="text-xl font-bold text-darkblueui">
            {members?.[0]?.user?.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagingChannelHeader;
