import { Video, Rating } from "@/components";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from "@stream-io/video-react-sdk";
import { createClient } from "@/utils/supabase/client";
import { createClient as serverSidePropsClient } from "@/utils/supabase/serverSidePropsClient";
import axios from "axios";
import { useRouter } from "next/router";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { SessionWithUsers } from "@/types";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import moment from "moment-timezone";
import { useStreamClient } from "@/context/StreamVideoClient";
import { useToast } from "@/components/ui/use-toast";
import { title } from "process";
import { Loader } from "lucide-react";
import { GetServerSideProps } from "next";

const VideoSession = () => {
  const [showRating, setShowRating] = useState(false);
  const [token, setToken] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [videoCall, setVideoCall] = useState<Call | null>(null);
  const [teacherId, setTeacherId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [session, setSession] = useState<SessionWithUsers | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [endCallTrigger, setEndCallTrigger] = useState<boolean>(false);

  const { user } = useUserStore();

  const { client: videoClient } = useStreamClient();

  const { toast } = useToast();

  console.log(user?.role, "User role");

  const endCall = async () => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .update({ status: "finished" })
        .eq("id", sessionId);

      if (error) {
        throw new Error("Error updating session");
      }

      await supabase
        .from("payments")
        .update({ status: "completed" })
        .eq("session_id", sessionId);

      setEndCallTrigger(true);

      if (user?.role === "teacher") {
        router.replace("/profile/dashboard");
      } else {
        router.replace(`/rating?teacherId=${teacherId}&sessionId=${sessionId}`);
      }

      toast({
        title: "Session Ended",
        description: "Session has been ended successfully",
      });

      setVideoCall(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again later",
        variant: "destructive",
      });
    }
  };

  const getTotalSessionTime = (durationInMins: number): string => {
    const minutes = Math.floor(durationInMins);
    const seconds = Math.floor((durationInMins % 1) * 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const startSessionTimer = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const scheduledLocalTime = moment
      .utc(session?.scheduledAt)
      .tz(userTimeZone);
    const sessionEnd = scheduledLocalTime
      .clone()
      .add(session?.durationInMins, "minutes");

    const interval = setInterval(async () => {
      const now = moment().tz(userTimeZone);

      if (now.isAfter(sessionEnd)) {
        clearInterval(interval);
        console.log("Session ended. Ending call...");
        await videoCall?.endCall();
      } else {
        const durationLeft = moment.duration(sessionEnd.diff(now));
        setTimeLeft(
          `${durationLeft.minutes()}:${
            durationLeft.seconds() < 10 ? "0" : ""
          }${durationLeft.seconds()}`
        );
      }
    }, 1000); // Update every second
  };

  const supabase = createClient();

  const router = useRouter();

  useEffect(() => {
    if (
      !router.query.sessionId ||
      !router.query.teacherId ||
      !router.query.studentId
    )
      return;

    setSessionId(router.query.sessionId as string);
    setTeacherId(router.query.teacherId as string);
    setStudentId(router.query.studentId as string);
  }, [router.query.sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) {
        console.log(error, "Error fetching session");
        return;
      }

      setSession(data as SessionWithUsers);
    };
    fetchSession();
  }, [sessionId]);

  const handleFinishClick = () => {
    setShowRating(true);
  };

  // useEffect(() => {
  //   (async () => {
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.log(error, "Error getting session");
  //       return;
  //     }

  //     const { data: axiosData } = await axios.get("/api/getStreamToken");

  //     setToken(axiosData?.token as string);
  //   })();
  // }, []);

  // const videoUser: User = {
  //   id: user?.id!,
  //   name: user?.name!,
  //   image: user?.image_url!,
  // };

  // const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
  //   null
  // );

  // useEffect(() => {
  //   if (!token) return;

  //   const client = new StreamVideoClient({
  //     apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  //     user: videoUser,
  //     token: token!,
  //   });
  //   setVideoClient(client);
  // }, [token]);

  useEffect(() => {
    if (!videoClient) return;
    (async () => {
      try {
        const calls = await videoClient.queryCalls({
          filter_conditions: {
            id: sessionId,
            ended_at: null,
            // starts_at: {
            //   $eq: new Date(session?.scheduledAt!).toISOString(),
            // },
            // ongoing: true,
          },
        });

        if (calls?.calls?.length > 0) {
          await calls?.calls[0]?.join();
          setVideoCall(calls?.calls[0]);
        }
      } catch (error) {
        console.log(error, "Error");
      }
    })();
  }, [videoClient, sessionId]);

  useEffect(() => {
    if (!videoCall) return;

    startSessionTimer();

    const handleCallEnd = async () => {
      console.log("Call ended");
      await endCall();
    };

    const handleCallLeave = async () => {
      router.back();
    };

    videoCall?.on("call.ended", handleCallEnd);

    videoCall?.on("participantLeft", handleCallLeave);

    return () => {
      videoCall?.off("callEnded", handleCallEnd);
      videoCall?.off("participantLeft", handleCallLeave);
    };
  }, [videoCall]);

  if (!videoClient || !videoCall || !sessionId)
    return (
      <div className="min-h-screen w-full items-center justify-center flex">
        <Loader className="w-12 h-12 animate-spin text-primary-blue" />
      </div>
    );

  return (
    <section className="w-full h-screen flex flex-col">
      {/* <StreamVideo client={videoClient}> */}
      <StreamCall call={videoCall}>
        <MyUILayout
          videoCall={videoCall}
          timeLeft={timeLeft}
          endCall={endCall}
        />
      </StreamCall>
      {/* </StreamVideo> */}
      {/* {!showRating ? <Video onFinish={handleFinishClick} /> : <Rating />} */}
    </section>
  );
};

export const MyUILayout: React.FC<{
  videoCall: Call;
  timeLeft: string;
  endCall: () => void;
}> = ({ videoCall, timeLeft, endCall }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const router = useRouter();

  const { user } = useUserStore();

  const supabase = createClient();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-primary-blue" />
      </div>
    );
  }

  return (
    <StreamTheme className="text-white">
      <div className="w-full sm:py-4 sm:px-10 px-4 items-center flex min-h-20 shadowprofile bg-white relative z-20 mb-10">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                videoCall?.leave();
                router.back();
              }}
              className="bg-primary-blue px-5 h-9 rounded-full text-white text-sm items-center hidden sm:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                className="mr-2"
              >
                <path
                  d="M0.292892 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM18 7L1 7V9L18 9V7Z"
                  fill="white"
                />
              </svg>
              Leave
            </button>
            {user?.role === "teacher" && (
              <button
                onClick={async () => {
                  await videoCall?.endCall();
                }}
                className="bg-darkblueui px-5 h-9 rounded-full text-white text-sm items-center hidden sm:flex"
              >
                End Session
              </button>
            )}
          </div>
          <div className="ml-10 sm:ml-0 text-black font-bold">{timeLeft}</div>
          <button className="sm:px-4 sm:py-2 px-3 py-1.5 rounded-full bg-darkblueui flex justify-center items-center sm:mt-4 hover:bg-dark">
            <FaRegCircleQuestion className="text-sm question-icon" />
            <span className="text-sm text-white ml-2 font-light">Help</span>
          </button>
        </div>
      </div>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const supabase = serverSidePropsClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const sessionId = query?.sessionId as string;

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  const sessionStatusesNotAllowed = [
    "finished",
    "cancelled",
    "payment_pending",
  ];

  const paymentStatusesNotAllowed = ["completed", "refunded"];

  if (
    sessionError ||
    paymentError ||
    sessionStatusesNotAllowed.includes(sessionData?.status) ||
    paymentStatusesNotAllowed.includes(paymentData?.status)
  ) {
    return {
      redirect: {
        destination: "/profile/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

export default VideoSession;
