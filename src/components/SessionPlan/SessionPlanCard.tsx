import { ArrowIconWhite, CrossSvgBlue } from "@/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiConversation } from "react-icons/bi";
import { DateTimePickerForm } from "../TimePicker/DateTimePicker";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "../ui/use-toast";
import { addMinutes, format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Clock, MessageSquare, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { Badge } from "../ui/badge";

type SessionPlanCardProps = {
  title: string;
  date: string;
  image: string;
  id: string;
  userId: string;
  status: string;
  durationInMinutes: number;
  refreshSessions: () => void;
  fromHistory?: boolean;
  teacherId: string;
};

const SessionPlanCard = ({
  title,
  date,
  image,
  id,
  userId,
  durationInMinutes,
  refreshSessions,
  fromHistory,
  status,
  teacherId,
}: SessionPlanCardProps) => {
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
        title: "Session Rescheduled",
        description: rescheduleData?.message,
      });

      refreshSessions();
    } catch (error) {
      toast({
        title: "Rescheduling Session Failed",
        description: "Failed to Reschedule the session. Please try again later",
        variant: "destructive",
      });
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
    try {
      const { data } = await axios.post("/api/paypal/payments/refund", {
        sessionId: id,
      });
      toast({
        title: "Session Cancelled",
        description: data?.message,
      });
      setIsCancelDialogOpen(false);
      refreshSessions();
    } catch (error: any) {
      toast({
        title: "Cancelling Session Failed",
        description:
          error?.response?.data?.error ||
          "Failed to cancel the session. Please try again later",
      });
    }
  };

  const startDate = new Date(date);
  const endDate = addMinutes(startDate, durationInMinutes);

  const formattedStartDate = format(startDate, "EEEE, MMM do, h:mmaaa");
  const formattedEndDate = format(endDate, "h:mmaaa");

  return (
    <>
      {fromHistory ? (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={image ?? ""} alt={title} />
                <AvatarFallback>{title?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {title}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {formattedStartDate} - {formattedEndDate}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge
                  variant={"default"}
                  className={
                    status === "cancelled"
                      ? "bg-red-500"
                      : status === "scheduled"
                        ? "bg-primary-blue"
                        : status === "payment_pending"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }
                >
                  {status?.replace("_", " ")}
                </Badge>
                <Link href={`/chat?channel=${userId}`}>
                  <Button
                    size="sm"
                    className="bg-[#1e1e4a] text-white hover:bg-[#2a2a5a]"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Go to Chat</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={image ?? ""} alt={title} />
                <AvatarFallback>{title?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {title}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {formattedStartDate}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {formattedEndDate}
                </p>
              </div>
              <Link href={`/chat?channel=${userId}`}>
                <Button
                  variant="outline"
                  className="bg-[#1e1e4a] text-white hover:bg-[#2a2a5a]"
                  onClick={() => {}}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </Link>
            </div>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{formattedStartDate}</p>
                <p className="text-sm text-gray-500">{formattedEndDate}</p>
              </div>
              <Button
                variant="outline"
                className="bg-[#1e1e4a] text-white hover:bg-[#2a2a5a]"
                onClick={() => {}}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 bg-gray-50 p-4">
            <Button
              variant="outline"
              className="border-[#1e1e4a] text-[#1e1e4a] hover:bg-[#1e1e4a] hover:text-white"
              onClick={() => setIsCancelDialogOpen(true)}
            >
              Cancel Session
            </Button>
            <Button
              variant="outline"
              className="border-[#1e1e4a] text-[#1e1e4a] hover:bg-[#1e1e4a] hover:text-white"
              onClick={() => setIsRescheduleDialogOpen(true)}
            >
              Reschedule Session
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* <div className="shadowprofile mt-5 bg-white w-[685px] min-h-20 rounded-md flex justify-center items-center">
        <div className="flex justify-center items-center ml-4">
          <div className="w-12 h-12 bg-[#D7E3F4] rounded-full justify-center flex items-center overflow-hidden">
            {image && (
              <Image
                src={image ?? ""}
                width={48}
                height={48}
                alt="profile"
                className="rounded-full"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col ml-6 items-start justify-center font-bold text-md w-full max-w-[30rem] max-h-20">
          <div className="overflow-hidden max-h-[22px]">
            <span className="text-darkblueui text-md underline overflow-hidden">
              {title}
            </span>
          </div>
          <span className="font-normal text-darkblueui text-sm mt-1">-</span>
        </div>
        <div className="flex ml-3 w-3/4 justify-evenly items-center">
          <div className="flex flex-col justify-center items-center">
            <Link
              href={`/chat?channel=${userId}`}
              className="flex flex-col justify-center items-center"
            >
              <Image src="/chat.png" width={29} height={29} alt="chat icon" />
              <span className="text-blueui text-center text-xs flex flex-col items-center whitespace-nowrap">
                Open
                <br />
                Chat
              </span>
            </Link>
          </div>
          {!fromHistory && (
            <div
              className="flex flex-col justify-center items-center"
              onClick={() => setIsRescheduleDialogOpen(!isRescheduleDialogOpen)}
            >
              <Image
                src="/calendaricon.png"
                width={29}
                height={29}
                alt="chat icon"
              />
              <span className="text-blueui text-center text-xs flex flex-col items-center whitespace-nowrap">
                Reschedule
                <br />
                Session
              </span>
            </div>
          )}

          {!fromHistory && (
            <div
              className="flex flex-col justify-center items-center mt-1"
              onClick={() => setIsCancelDialogOpen(true)}
            >
              <CrossSvgBlue />
              <span className="text-blueui text-center text-xs flex flex-col items-center whitespace-nowrap mt-2">
                Cancel
                <br />
                Session
              </span>
            </div>
          )}
        </div>
      </div> */}

      {isRescheduleDialogOpen && (
        // <Dialog
        //   open={isRescheduleDialogOpen}
        //   onOpenChange={setIsRescheduleDialogOpen}
        // >
        //   <DialogContent className="sm:max-w-[425px]">
        //     <DialogHeader>
        //       <DialogTitle>Reschedule Session</DialogTitle>
        //       <DialogDescription>
        //         Pick a new date and time to reschedule your session.
        //       </DialogDescription>
        //     </DialogHeader>
        //     <div className="grid gap-4 py-4">
        //       <DateTimePickerForm
        //         onSubmitHandler={onRescheduleSession}
        //         onClose={() => setIsRescheduleDialogOpen(false)}
        //         buttonTitle="Reschedule"
        //       />
        //     </div>
        //   </DialogContent>
        // </Dialog>

        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div
            className="absolute h-full w-full bg-gray-900 opacity-50"
            onClick={() => setIsRescheduleDialogOpen(false)}
          ></div>

          <Card className="z-50">
            <CardContent className="sm:max-w-[425px]">
              <CardHeader className="px-0">
                <CardTitle>Reschedule Session</CardTitle>
                <CardDescription>
                  Pick a new date and time to reschedule your session.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-4 py-4">
                <DateTimePickerForm
                  onSubmitHandler={onRescheduleSession}
                  onClose={() => setIsRescheduleDialogOpen(false)}
                  buttonTitle="Reschedule"
                />
              </div>
            </CardContent>
          </Card>

          {/* <div className="bg-white w-11/12 md:max-w-xl mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
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
          </div> */}
        </div>
      )}
      {isCancelDialogOpen && (
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Session</DialogTitle>
              <DialogDescription>
                Are sure you want to cancel this meeting?
                <span className="mt-1 block text-xs text-red-500">
                  Please note: cancellations made within 24 hours of the session
                  will be fully charged.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                No, keep session
              </Button>
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={onCancelSession}
              >
                Yes, cancel session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        // <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
        //   <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

        //   <div className="bg-white w-11/12 md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
        //     <div className="py-4 text-left px-6">
        //       <div className="flex w-full  items-center">
        //         <Image
        //           src="/calendar.png"
        //           width={74}
        //           height={74}
        //           alt="calendar"
        //           className="sm:w-10 sm:h-10 w-16 h-12"
        //         />
        //         <div className="flex flex-col  ml-5">
        //           <p className="text-darkblueui font-bold text-lg">
        //             Cancel Session ?
        //           </p>
        //           <p className="text-darkblueui text-sm">
        //             Are you sure you want to cancel the session ? This action is
        //             irreversible.
        //           </p>
        //         </div>
        //       </div>
        //       <div className="flex justify-center items-center mt-6 ml-5">
        //         <div className="flex w-full justify-end mt-5">
        //           <button
        //             className="mr-5"
        //             onClick={() => setIsCancelDialogOpen(false)}
        //           >
        //             <span className="text-darkblueui text-sm underline underline-offset-2">
        //               Cancel
        //             </span>
        //           </button>
        //           <button
        //             onClick={onCancelSession}
        //             className="bg-darkblueui px-5 h-9 rounded-full flex text-white text-sm items-center"
        //           >
        //             Cancel
        //             <ArrowIconWhite />
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
};

export default SessionPlanCard;
