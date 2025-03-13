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
import ToasterTitle from "@/components/ui/toaster-title";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();
  const { client: videoClient } = useStreamClient();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  console.log("User role:", user?.role);
  console.log("Query params:", router.query);

  // Set session parameters from URL
  useEffect(() => {
    const { sessionId, teacherId, studentId } = router.query;

    if (!sessionId || !teacherId || !studentId) {
      console.log("Missing required query parameters");
      setError("Missing required parameters");
      return;
    }

    console.log("Setting session parameters:", {
      sessionId,
      teacherId,
      studentId,
    });
    setSessionId(sessionId as string);
    setTeacherId(teacherId as string);
    setStudentId(studentId as string);
  }, [router.query]);

  // Fetch session details
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        console.log("Fetching session data for ID:", sessionId);
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", sessionId)
          .single();

        if (error) {
          console.error("Error fetching session:", error);
          setError(`Failed to fetch session: ${error.message}`);
          return;
        }

        console.log("Session data retrieved:", data);
        setSession(data as SessionWithUsers);
      } catch (err) {
        console.error("Exception in fetchSession:", err);
        setError(
          `Exception: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    };

    fetchSession();
  }, [sessionId]);

  // Initialize video call
  useEffect(() => {
    if (!videoClient || !sessionId) return;

    const initializeCall = async () => {
      try {
        console.log("Initializing video call for session:", sessionId);
        setLoading(true);

        const calls = await videoClient.queryCalls({
          filter_conditions: {
            id: sessionId,
            ended_at: null,
          },
        });

        console.log("Calls query result:", calls);

        if (calls?.calls?.length > 0) {
          console.log("Found existing call, joining...");
          await calls.calls[0].join();
          setVideoCall(calls.calls[0]);
        } else {
          console.log("No active call found for this session");
          setError("No active call found for this session");
        }
      } catch (err) {
        console.error("Error initializing video call:", err);
        setError(
          `Failed to initialize call: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    };

    initializeCall();
  }, [videoClient, sessionId]);

  // Handle call events
  useEffect(() => {
    if (!videoCall) return;

    console.log("Setting up call event handlers");
    startSessionTimer();

    const handleCallEnd = async () => {
      console.log("Call ended event triggered");
      await endCall();
    };

    const handleCallLeave = async () => {
      console.log("Participant left event triggered");
      router.push("/profile/dashboard");
    };

    videoCall.on("call.ended", handleCallEnd);
    videoCall.on("participantLeft", handleCallLeave);

    return () => {
      console.log("Cleaning up call event handlers");
      videoCall.off("call.ended", handleCallEnd);
      videoCall.off("participantLeft", handleCallLeave);
    };
  }, [videoCall]);

  const endCall = async () => {
    try {
      console.log("Ending call for session:", sessionId);

      const { data, error } = await supabase
        .from("sessions")
        .update({ status: "finished" })
        .eq("id", sessionId);

      if (error) {
        console.error("Error updating session status:", error);
        throw new Error(`Error updating session: ${error.message}`);
      }

      console.log("Session marked as finished:", data);

      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .update({ status: "completed" })
        .eq("session_id", sessionId);

      if (paymentError) {
        console.error("Error updating payment status:", paymentError);
      } else {
        console.log("Payment marked as completed:", paymentData);
      }

      setEndCallTrigger(true);

      if (user?.role === "teacher") {
        console.log("Redirecting teacher to dashboard");
        router.push("/profile/dashboard");
      } else {
        console.log("Redirecting student to rating page");
        router.push(`/rating?teacherId=${teacherId}&sessionId=${sessionId}`);
      }

      toast({
        title: <ToasterTitle title="Session Ended" type="success" />,
        description: "Session has been ended successfully",
      });

      setVideoCall(null);
    } catch (err) {
      console.error("Failed to end call:", err);
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Failed to end session. Please try again later",
        variant: "destructive",
      });
    }
  };

  const startSessionTimer = () => {
    if (!session?.scheduledAt || !session?.durationInMins) {
      console.error("Missing session schedule or duration");
      return;
    }

    console.log("Starting session timer with:", {
      scheduledAt: session.scheduledAt,
      duration: session.durationInMins,
    });

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const scheduledLocalTime = moment.utc(session.scheduledAt).tz(userTimeZone);
    const sessionEnd = scheduledLocalTime
      .clone()
      .add(session.durationInMins, "minutes");

    console.log("Session scheduled time:", scheduledLocalTime.format());
    console.log("Session end time:", sessionEnd.format());

    const interval = setInterval(async () => {
      const now = moment().tz(userTimeZone);

      if (now.isAfter(sessionEnd)) {
        console.log("Session time expired, ending call");
        clearInterval(interval);
        await videoCall?.endCall();
      } else {
        const durationLeft = moment.duration(sessionEnd.diff(now));
        setTimeLeft(
          `${durationLeft.minutes()}:${
            durationLeft.seconds() < 10 ? "0" : ""
          }${durationLeft.seconds()}`,
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader className="mb-4 h-12 w-12 animate-spin text-primary-blue" />
        <p className="text-gray-600">Initializing video session...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-700">
            Unable to join video session
          </h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/profile/dashboard")}
            className="rounded-md bg-primary-blue px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render when client or call is not available
  if (!videoClient || !videoCall || !sessionId) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader className="mb-4 h-12 w-12 animate-spin text-primary-blue" />
        <p className="text-gray-600">Connecting to video session...</p>
      </div>
    );
  }

  return (
    <section className="flex h-screen w-full flex-col">
      <StreamCall call={videoCall}>
        <MyUILayout
          videoCall={videoCall}
          timeLeft={timeLeft}
          endCall={endCall}
        />
      </StreamCall>
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
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-blue" />
      </div>
    );
  }

  return (
    <StreamTheme className="text-white">
      <div className="shadowprofile relative z-20 mb-10 flex min-h-20 w-full items-center bg-white px-4 sm:px-10 sm:py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                videoCall?.leave();
                router.back();
              }}
              className="hidden h-9 items-center rounded-full bg-primary-blue px-5 text-sm text-white sm:flex"
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
                className="hidden h-9 items-center rounded-full bg-darkblueui px-5 text-sm text-white sm:flex"
              >
                End Session
              </button>
            )}
          </div>
          <div className="ml-10 font-bold text-black sm:ml-0">{timeLeft}</div>
          <button className="hover:bg-dark flex items-center justify-center rounded-full bg-darkblueui px-3 py-1.5 sm:mt-4 sm:px-4 sm:py-2">
            <FaRegCircleQuestion className="question-icon text-sm" />
            <span className="ml-2 text-sm font-light text-white">Help</span>
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
