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
        }
      );

      setIsRescheduleDialogOpen(false);

      toast({
        title: "Session Rescheduled",
        description: rescheduleData?.message,
      });

      refreshSessions();
    } catch (error) {
      toast({
        title: "Rescheduling Session Failed",
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
        title: "Cancelling Session Failed",
        description: "Failed to cancel the session. Please try again later",
      });
      console.log(error, "Error");
      return;
    }

    setIsCancelDialogOpen(false);

    toast({
      title: "Session Cancelled",
      description: "Session has been cancelled successfully",
    });

    refreshSessions();
  };

  return (
    <>
      <div className="shadowprofile mt-5 bg-white w-96 h-36 rounded-md flex flex-col justify-center items-center px-4">
        <div className="flex w-full justify-center items-center">
          <div className="flex justify-start items-start w-2/4">
            <div className="w-12 h-12 bg-[#D7E3F4] rounded-full justify-center flex items-center overflow-hidden ">
              {image && (
                <Image
                  src={image}
                  width={48}
                  height={48}
                  alt="profile"
                  className="rounded-full "
                />
              )}
            </div>
          </div>
          <div className="flex ml-3 w-3/4 justify-end items-end space-x-4">
            {/* 1st Icon Link */}
            <div className="flex flex-col justify-center items-center">
              <Link
                href={`/chat?channel=${userId}`}
                className="flex flex-col justify-center items-center"
              >
                <Image src="/chat.png" width={25} height={25} alt="chat icon" />
                <span className="text-blueui text-center text-[10px] flex flex-col items-center whitespace-nowrap">
                  Open
                  <br />
                  Chat
                </span>
              </Link>
            </div>
            {/* 2nd Icon Link */}
            {!fromHistory && (
              <div
                className="flex flex-col justify-center items-center"
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
                <span className="text-blueui text-center text-[10px] flex flex-col items-center whitespace-nowrap">
                  Reschedule
                  <br />
                  Session
                </span>
              </div>
            )}

            {/* 3rd Icon Link */}
            {!fromHistory && (
              <div
                className="flex flex-col justify-center items-center mt-1"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                <CrossSvgBlue />
                <span className="text-blueui text-center text-[10px] flex flex-col items-center whitespace-nowrap mt-2">
                  Cancel
                  <br />
                  Session
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center font-bold text-md w-full mt-4">
          <div className="overflow-hidden max-h-[22px]">
            <span className="text-darkblueui text-md underline overflow-hidden">
              {title}
            </span>
          </div>
          <span className="font-normal text-darkblueui text-sm">{date}</span>
        </div>
      </div>
      {isRescheduleDialogOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div className="bg-white w-11/12 md:max-w-xl mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
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
                    Pick a date and time to reschedule
                  </p>
                  <p className="text-darkblueui text-sm">
                    Format is in 24-hour time
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center mt-6 ml-5">
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
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

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
                    Cancel Session ?
                  </p>
                  <p className="text-darkblueui text-sm">
                    Are you sure you want to cancel the session ? This action is
                    irreversible.
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center mt-6 ml-5">
                <div className="flex w-full justify-end mt-5">
                  <button
                    className="mr-5"
                    onClick={() => setIsCancelDialogOpen(false)}
                  >
                    <span className="text-darkblueui text-sm underline underline-offset-2">
                      Cancel
                    </span>
                  </button>
                  <button
                    onClick={onCancelSession}
                    className="bg-darkblueui px-5 h-9 rounded-full flex text-white text-sm items-center"
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
