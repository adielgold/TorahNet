import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";
import { SessionWithUsers } from "@/types";
import { createClient } from "@/utils/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertToUTC = (localTime: string) => {
  const localMoment = moment.tz(localTime, "HH:mm", getUserTimeZone());
  return localMoment.utc().format("HH:mm");
};

export const convertToLocalTime = (utcTime: string) => {
  const utcMoment = moment.utc(utcTime, "HH:mm");
  return utcMoment.tz(getUserTimeZone()).format("HH:mm");
};

export const shouldShowJoinButton = (session: SessionWithUsers): boolean => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert scheduledAt from UTC to the user's local time
  const scheduledLocalTime = moment.utc(session.scheduledAt).tz(userTimeZone);

  const now = moment().tz(userTimeZone); // Current time in user's local time zone
  const sessionEnd = scheduledLocalTime
    .clone()
    .add(session.durationInMins, "minutes");

  // Check if the current time is between the scheduled time and the session end time
  return now.isBetween(scheduledLocalTime, sessionEnd);
};

export const getUserReviewData = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_teacher_review_stats", {
    teacher_id_input: userId,
  });
  if (error) {
    console.error("Error fetching review data:", error);
    return { review_count: 0, average_score: 0 };
  }

  return {
    data: data?.[0],
  };
};
