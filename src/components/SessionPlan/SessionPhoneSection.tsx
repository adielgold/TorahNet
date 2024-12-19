import React from "react";
import SessionPhoneCard from "./SessionPhoneCard";
import { SESSION_DATA } from "../../constants/constant";
import { SessionWithUsers } from "@/types";
import { useUserStore } from "@/stores/userStore";

interface SessionPlanProps {
  sessions: SessionWithUsers[] | [];
  refreshSessions: () => void;
  fromHistory?: boolean;
}

const SessionPhoneSection: React.FC<SessionPlanProps> = ({
  sessions,
  refreshSessions,
  fromHistory,
}) => {
  const { user } = useUserStore();

  return (
    <div>
      {sessions &&
        sessions.map((session) => (
          <SessionPhoneCard
            key={session.id}
            userId={
              user?.role === "student"
                ? session?.teacher?.id!
                : session?.student?.id!
            }
            id={session.id}
            title={
              user?.role === "student"
                ? session?.teacher?.name!
                : session?.student?.name!
            }
            date={session.scheduledAt!}
            image={
              user?.role === "student"
                ? session?.teacher?.image_url!
                : session?.student?.image_url!
            }
            durationInMinutes={session.durationInMins!}
            refreshSessions={refreshSessions}
            fromHistory={fromHistory}
          />
        ))}
    </div>
  );
};

export default SessionPhoneSection;
