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
import moment from "moment-timezone";

const MessagingChannelFooter: React.FC = () => {
  const { client } = useChatContext();
  const { channel } = useChannelStateContext();
  const router = useRouter();

  const { toast } = useToast();

  const [existingSession, setExistingSession] =
    useState<SessionWithUsers | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [teacherHourlyRate, setTeacherHourlyRate] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const unfiltredMembers = Object.values(channel.state.members || {});

  const members = Object.values(channel.state.members).filter(
    (member) => member.user?.id !== client?.user?.id,
  );

  const onlineMembers = unfiltredMembers.filter(
    (member) => member.user?.online,
  );

  const supabase = createClient();

  const { user } = useUserStore();

  const { client: streamClient } = useStreamClient();

  const fetchTeacherHourlyRate = async () => {
    setIsLoading(true);
    const teacherId =
      user?.role === "teacher" ? user?.id : members?.[0]?.user?.id;

    if (!teacherId) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("payment_details")
      .select("hourly_rate")
      .eq("id", teacherId)
      .single();

    console.log(data, "Data");

    if (error) {
      console.error("Error fetching hourly rate:", error);
      setTeacherHourlyRate(0);
    } else {
      setTeacherHourlyRate(data?.hourly_rate || 0);
    }

    setIsLoading(false);
  };

  const fetchExistingSession = async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    let query = supabase.from("sessions").select("*");

    if (user?.role === "teacher") {
      query = query.eq("teacher_id", user?.id);
      query = query.eq("student_id", members?.[0]?.user?.id!);
    } else {
      query = query.eq("student_id", user?.id!);
      query = query.eq("teacher_id", members?.[0]?.user?.id!);
    }

    query = query
      .gte("scheduledAt", oneHourAgo.toISOString())
      .eq("status", "scheduled");

    const { data, error } = await query;

    if (error) {
      console.log(error, "Error");
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Failed to fetch existing session",
        variant: "destructive",
      });
      return;
    }

    if (data?.length > 0) {
      setExistingSession((data?.[0] as SessionWithUsers) ?? null);
    }
  };

  const onBookSession = async (data: { dateTime: Date }) => {
    const teacherId =
      user?.role === "teacher" ? user?.id : members?.[0]?.user?.id;

    if (!teacherId) {
      toast({
        title: <ToasterTitle title="Booking Failed" type="error" />,
        description: "Could not identify the teacher",
      });
      return;
    }

    // Fetch teacher's availability
    const { data: teacherData, error: teacherError } = await supabase
      .from("users")
      .select("available_hours")
      .eq("id", teacherId)
      .single();

    if (teacherError || !teacherData?.available_hours) {
      toast({
        title: <ToasterTitle title="Booking Failed" type="error" />,
        description: "Could not verify teacher's availability",
      });
      return;
    }

    // Convert booking time to teacher's timezone for comparison
    const teacherAvailability = teacherData?.available_hours as any;
    const bookingTimeInTeacherTz = moment(data.dateTime).tz(
      teacherAvailability.timezone,
    );

    const bookingTime = bookingTimeInTeacherTz.format("HH:mm");

    // Handle overnight schedule (when end time is less than start time)
    const isOvernight = teacherAvailability.end < teacherAvailability.start;

    let isAvailable;
    if (isOvernight) {
      // For overnight schedule, time is available if it's after start OR before end
      isAvailable =
        moment(bookingTime, "HH:mm").isBetween(
          moment(teacherAvailability.start, "HH:mm"),
          moment("23:59", "HH:mm"),
          "minute",
          "[]",
        ) ||
        moment(bookingTime, "HH:mm").isBetween(
          moment("00:00", "HH:mm"),
          moment(teacherAvailability.end, "HH:mm"),
          "minute",
          "[]",
        );
    } else {
      // Normal schedule (same day)
      isAvailable = moment(bookingTime, "HH:mm").isBetween(
        moment(teacherAvailability.start, "HH:mm"),
        moment(teacherAvailability.end, "HH:mm"),
        "minute",
        "[]",
      );
    }

    if (!isAvailable) {
      // Convert teacher's hours to student's timezone for display
      const studentTimezone = moment.tz.guess();
      const availableStart = moment
        .tz(teacherAvailability.start, "HH:mm", teacherAvailability.timezone)
        .tz(studentTimezone)
        .format("HH:mm");

      const availableEnd = moment
        .tz(teacherAvailability.end, "HH:mm", teacherAvailability.timezone)
        .tz(studentTimezone)
        .format("HH:mm");

      toast({
        title: <ToasterTitle title="Invalid Time" type="error" />,
        description: `Teacher is only available from ${availableStart} to ${availableEnd} ${studentTimezone}${
          isOvernight ? " (Overnight Schedule)" : ""
        }`,
      });
      return;
    }

    const startsAt = data.dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const { data: sessionData, error } = await supabase
      .from("sessions")
      .insert({
        student_id:
          user?.role === "student"
            ? user?.id
            : members?.length > 0
              ? members?.[0]?.user?.id
              : null,
        teacher_id:
          user?.role === "teacher"
            ? user?.id
            : members?.length > 0
              ? members?.[0]?.user?.id
              : null,
        durationInMins: 60,
        scheduledAt: data.dateTime.toISOString(),
        startsAt: startsAt,
        // status: "scheduled",
        status: "pending_payment",
      })
      .select(`*`)
      .single();

    if (error) {
      toast({
        title: <ToasterTitle title="Booking Failed" type="error" />,
        description: "Failed to book the session. Please try again later",
      });
      console.log(error, "Error");
      return;
    }

    if (sessionData) {
      const call = streamClient?.call("default", sessionData.id);
      await call?.create({
        members_limit: 2,
        data: {
          members: [
            {
              user_id: sessionData.teacher_id!,
              role: "admin",
            },
            {
              user_id: sessionData.student_id!,
              role: "user",
            },
          ],
          starts_at: new Date(sessionData.scheduledAt!).toISOString(),
        },
      });

      await fetchExistingSession();

      setIsDialogOpen(false);
      // need to remove if PayPal or other payment methods are implemented
      // try {
      //   const response = await fetch("/api/mockpayment/create-order", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       sessionId: sessionData.id,
      //     }),
      //   });

      //   const data = await response.json();
      //   console.log(data, "Data");
      // } catch (error) {
      //   console.error("Error creating PayPal order:", error);
      // }

      // setIsPlanDialogOpen(false);

      // toast({
      //   title: <ToasterTitle title="Session Booked" type="success" />,
      //   description: "Session has been booked successfully",
      // });
      // router.push(
      //   `/checkout?sessionId=${sessionData.id}&studentId=${sessionData.student_id}&teacherId=${sessionData.teacher_id}&amount=${sessionData.teacher?.[0]?.payment_details?.hourly_rate}`,
      // );
      // till here

      // Paypal Implementation
      try {
        const response = await fetch("/api/paypal/payments/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionData.id,
          }),
        });

        const data = await response.json();

        if (data.approveUrl) {
          window.location.href = data.approveUrl;
          // Or if using Next.js router:
          // router.push(data.approveUrl);
        } else if (data.payerActionUrl) {
          window.location.href = data.payerActionUrl;
        }
      } catch (error) {
        console.error("Error creating PayPal order:", error);
      }
    }
  };

  useEffect(() => {
    fetchExistingSession();
    fetchTeacherHourlyRate();
  }, []);

  //paypal implementation

  const paymentProcessed = useRef(false);

  useEffect(() => {
    const { token, PayerID, payment, sessionId, teacherId, studentId } =
      router.query;

    if (token && PayerID && payment === "true" && !paymentProcessed.current) {
      const handlePayment = async () => {
        try {
          paymentProcessed.current = true;

          const { success, data, error } = await capturePaypalPayment(
            token as string,
            sessionId as string,
            teacherId as string,
            studentId as string,
          );

          if (success) {
            localStorage.setItem(`payment_${token}`, "captured");

            toast({
              title: "Payment Successful!",
              description: "Your payment has been processed successfully.",
              variant: "default",
            });
            console.log(data, "Data");
            window.history.replaceState(null, "", "/chat");
          } else {
            toast({
              title: "Payment Failed",
              description:
                typeof error === "string"
                  ? error
                  : "There was an error processing your payment.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Payment capture error:", error);
        }
      };

      handlePayment();
    }
  }, [router.query]);

  return (
    <div className="flex min-h-[80px] items-center justify-between px-5">
      <div className="flex items-center gap-3">
        {/* <Avatar
          name={members?.[0]?.user?.name}
          image={members?.[0]?.user?.image}
          size={50}
          user={members?.[0]?.user}
        />
        <div>
          <p className="text-xl font-bold text-darkblueui">
            {members?.[0]?.user?.name}
          </p>
        </div> */}
      </div>
      {existingSession ? (
        <div className="flex items-center gap-4">
          {shouldShowJoinButton(existingSession) && (
            <button
              onClick={() =>
                router.push(
                  `/videoSession?sessionId=${existingSession?.id}&studentId=${existingSession?.student_id}&teacherId=${existingSession?.teacher_id}`,
                )
              }
              className="flex h-9 items-center whitespace-nowrap rounded-full bg-primary-blue px-4 text-sm text-white"
            >
              <FaUser className="mr-2" />
              Join Meeting
            </button>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsDialogOpen(!isDialogOpen)}
                className="flex h-9 items-center whitespace-nowrap rounded-full bg-darkblueui px-4 text-sm text-white"
              >
                <FaUser className="mr-2" />
                View Meeting
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-indigo-900">
                  Your Session Details
                </DialogTitle>
              </DialogHeader>
              <AnimatePresence>
                {isDialogOpen && (
                  <motion.div
                    className="space-y-6 py-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-6 w-6 text-darkblueui" />
                        <span className="text-lg font-medium text-gray-700">
                          {existingSession
                            ? new Date(
                                existingSession?.scheduledAt!,
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-6 w-6 text-darkblueui" />
                        <span className="text-lg font-medium text-gray-700">
                          {existingSession
                            ? new Date(
                                existingSession?.scheduledAt!,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-darkblueui text-white"
                      onClick={() => {
                        // Add calendar download logic here
                        console.log("Downloading calendar...");
                        setIsDialogOpen(false);
                      }}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Calendar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <button
          onClick={() => {
            if (teacherHourlyRate && teacherHourlyRate > 0) {
              setIsPlanDialogOpen(!isPlanDialogOpen);
            }
          }}
          disabled={isLoading || !teacherHourlyRate || teacherHourlyRate === 0}
          className={`flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm ${
            isLoading
              ? "cursor-wait bg-gray-300 text-gray-500"
              : teacherHourlyRate && teacherHourlyRate > 0
                ? "cursor-pointer bg-darkblueui text-white"
                : "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60"
          }`}
        >
          <FaUser className="mr-2" />
          {isLoading
            ? "Loading..."
            : teacherHourlyRate === 0
              ? "Unavailable"
              : "Plan Meeting"}
        </button>
      )}

      {isPlanDialogOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div
            className="absolute h-full w-full bg-gray-900 opacity-50"
            onClick={() => setIsPlanDialogOpen(false)}
          ></div>

          <Card className="z-50">
            <CardContent className="sm:max-w-[425px]">
              <CardHeader className="px-0">
                <CardTitle>Schedule Session</CardTitle>
                <CardDescription>
                  Pick a new date and time to schedule your session.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-4 py-4">
                <DateTimePickerForm
                  onSubmitHandler={onBookSession}
                  onClose={() => setIsPlanDialogOpen(false)}
                  buttonTitle="Schedule"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* {isDialogOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div
            onClick={() => setIsDialogOpen(false)}
            className="absolute w-full h-full bg-gray-900 opacity-50"
          ></div>

          {existingSession ? (
            <div className="bg-[#eff4fa] w-11/12 md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
              <div className="py-4 text-center px-6">
                <p className="text-darkblueui font-bold text-xl mt-4">
                  Time and Date of your session
                </p>

                <div className="flex justify-between items-center mt-7  max-w-[75%] mx-auto ">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <p className="text-darkblueui text-lg">
                      {existingSession
                        ? new Date(
                            existingSession?.scheduledAt!
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <p className="text-darkblueui text-lg">
                      {existingSession
                        ? new Date(
                            existingSession?.scheduledAt!
                          ).toLocaleTimeString()
                        : ""}
                    </p>
                  </div>
                </div>

                <button className="bg-[#6893D4] px-4 h-9 rounded-full text-white text-sm items-center whitespace-nowrap flex mx-auto mt-8 mb-3">
                  Download Calendar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white w-11/12 md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
              <div className="py-4 text-left px-6">
                <div className="flex w-full  items-center">
                  <Image
                    src="/calendar.png"
                    width={74}
                    height={74}
                    alt="calendar"
                    className="sm:w-10 sm:h-10 w-16 h-12"
                  />
                  <div className="flex flex-col  ml-5">
                    <p className="text-darkblueui font-bold text-lg">
                      Pick a date and time
                    </p>
                    <p className="text-darkblueui text-sm">
                      Format is in 24-hour time
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center mt-6 ml-5">
                  <DateTimePickerForm
                    onSubmitHandler={onBookSession}
                    onClose={() => setIsDialogOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

export default MessagingChannelFooter;
