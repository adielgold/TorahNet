import { ArrowIconWhite, CrossSvgBlue } from "@/Icons";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiConversation } from "react-icons/bi";
import { useToast } from "../ui/use-toast";
import { DateTimePickerForm } from "../TimePicker/DateTimePicker";
import axios from "axios";
import ToasterTitle from "../ui/toaster-title";

type SessionPhoneCardProps = {
  title: string;
  date: string;
  image: string;
  id: string;
  userId: string;
  durationInMinutes: number;
  refreshSessions: () => void;
  fromHistory?: boolean;
};

const SessionPhoneCard = ({
  title,
  date,
  image,
  id,
  userId,
  durationInMinutes,
  refreshSessions,
  fromHistory,
}: SessionPhoneCardProps) => {
  const router = useRouter();

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const supabase = createClient();

  const { user } = useUserStore();

  const { toast } = useToast();

  const onRescheduleSession = async (data: { dateTime: Date }) => {
    const startsAt = data.dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const { data: rescheduleData } = await axios.post(
        "/api/payments/reschedule",
        {
          sessionId: id,
          startsAt,
          scheduledAt: data.dateTime,
        },
      );

      setIsRescheduleDialogOpen(false);

      toast({
        title: <ToasterTitle title="Session Rescheduled" type="success" />,
        description: rescheduleData?.message,
      });

      refreshSessions();
    } catch (error) {
      toast({
        title: (
          <ToasterTitle title="Rescheduling Session Failed" type="error" />
        ),
        description: "Failed to Reschedule the session. Please try again later",
      });
      console.log(error, "Error");
    }

    // const { data: sessionData, error } = await supabase
    //   .from("sessions")
    //   .update({
    //     scheduledAt: data.dateTime.toISOString(),
    //     startsAt: startsAt,
    //   })
    //   .eq("id", id)
    //   .select("*")
    //   .single();

    // const {} = await supabase.from("payments").update({
    //   payout_due_date:new Date(
    //     new Date(data.dateTime).getTime() + 7 * 24 * 60 * 60 * 1000
    //   ).toISOString()
    // })

    // if (error) {

    //   return;
    // }
  };

  const onCancelSession = async () => {
    const { error } = await supabase.from("sessions").delete().eq("id", id);

    if (error) {
      toast({
        title: <ToasterTitle title="Cancelling Session Failed" type="error" />,
        description: "Failed to cancel the session. Please try again later",
      });
      console.log(error, "Error");
      return;
    }

    setIsCancelDialogOpen(false);

    toast({
      title: <ToasterTitle title="Session Cancelled" type="success" />,
      description: "Session has been cancelled successfully",
    });

    refreshSessions();
  };

  return (
    <>
      <div className="shadowprofile mt-5 flex h-36 w-96 flex-col items-center justify-center rounded-md bg-white px-4">
        <div className="flex w-full items-center justify-center">
          <div className="flex w-2/4 items-start justify-start">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#D7E3F4]">
              {image && (
                <Image
                  src={image}
                  width={48}
                  height={48}
                  alt="profile"
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          <div className="ml-3 flex w-3/4 items-end justify-end space-x-4">
            {/* 1st Icon Link */}
            <div className="flex flex-col items-center justify-center">
              <Link
                href={`/chat?channel=${userId}`}
                className="flex flex-col items-center justify-center"
              >
                <Image src="/chat.png" width={25} height={25} alt="chat icon" />
                <span className="flex flex-col items-center whitespace-nowrap text-center text-[10px] text-blueui">
                  Open
                  <br />
                  Chat
                </span>
              </Link>
            </div>
            {/* 2nd Icon Link */}
            {!fromHistory && (
              <div
                className="flex flex-col items-center justify-center"
                onClick={() =>
                  setIsRescheduleDialogOpen(!isRescheduleDialogOpen)
                }
              >
                <Image
                  src="/calendaricon.png"
                  width={25}
                  height={25}
                  alt="chat icon"
                />
                <span className="flex flex-col items-center whitespace-nowrap text-center text-[10px] text-blueui">
                  Reschedule
                  <br />
                  Session
                </span>
              </div>
            )}

            {/* 3rd Icon Link */}
            {!fromHistory && (
              <div
                className="mt-1 flex flex-col items-center justify-center"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                <CrossSvgBlue />
                <span className="mt-2 flex flex-col items-center whitespace-nowrap text-center text-[10px] text-blueui">
                  Cancel
                  <br />
                  Session
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-md mt-4 flex w-full flex-col items-start justify-center font-bold">
          <div className="max-h-[22px] overflow-hidden">
            <span className="text-md overflow-hidden text-darkblueui underline">
              {title}
            </span>
          </div>
          <span className="text-sm font-normal text-darkblueui">{date}</span>
        </div>
      </div>
      {isRescheduleDialogOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div className="absolute h-full w-full bg-gray-900 opacity-50"></div>

          <div className="z-50 mx-auto w-11/12 overflow-y-auto rounded-xl bg-white shadow-lg md:max-w-xl">
            <div className="px-6 py-4 text-left">
              <div className="flex w-full items-center">
                <Image
                  src="/calendar.png"
                  width={74}
                  height={74}
                  alt="calendar"
                  className="h-12 w-16 sm:h-10 sm:w-10"
                />
                <div className="ml-5 flex flex-col">
                  <p className="text-lg font-bold text-darkblueui">
                    Pick a date and time to reschedule
                  </p>
                  <p className="text-sm text-darkblueui">
                    Format is in 24-hour time
                  </p>
                </div>
              </div>
              <div className="ml-5 mt-6 flex items-center justify-center">
                <DateTimePickerForm
                  onSubmitHandler={onRescheduleSession}
                  onClose={() => setIsRescheduleDialogOpen(false)}
                  buttonTitle="Reschedule"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isCancelDialogOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div className="absolute h-full w-full bg-gray-900 opacity-50"></div>

          <div className="z-50 mx-auto w-11/12 overflow-y-auto rounded-xl bg-white shadow-lg md:max-w-lg">
            <div className="px-6 py-4 text-left">
              <div className="flex w-full items-center">
                <Image
                  src="/calendar.png"
                  width={74}
                  height={74}
                  alt="calendar"
                  className="h-12 w-16 sm:h-10 sm:w-10"
                />
                <div className="ml-5 flex flex-col">
                  <p className="text-lg font-bold text-darkblueui">
                    Cancel Session ?
                  </p>
                  <p className="text-sm text-darkblueui">
                    Are you sure you want to cancel the session ? This action is
                    irreversible.
                  </p>
                </div>
              </div>
              <div className="ml-5 mt-6 flex items-center justify-center">
                <div className="mt-5 flex w-full justify-end">
                  <button
                    className="mr-5"
                    onClick={() => setIsCancelDialogOpen(false)}
                  >
                    <span className="text-sm text-darkblueui underline underline-offset-2">
                      Cancel
                    </span>
                  </button>
                  <button
                    onClick={onCancelSession}
                    className="flex h-9 items-center rounded-full bg-darkblueui px-5 text-sm text-white"
                  >
                    Cancel
                    <ArrowIconWhite />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionPhoneCard;
