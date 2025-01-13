import React from "react";
import SessionPlanCard from "./SessionPlanCard";
import { SESSION_DATA } from "../../constants/constant";
import { SessionWithUsers } from "@/types";
import { useUserStore } from "@/stores/userStore";

interface SessionPlanProps {
  sessions: SessionWithUsers[] | [];
  refreshSessions: () => void;
  fromHistory?: boolean;
}

const SessionPlan: React.FC<SessionPlanProps> = ({
  sessions,
  refreshSessions,
  fromHistory,
}) => {
  const { user } = useUserStore();

  return (
    <div
      className={
        fromHistory ? "grid gap-4 md:grid-cols-2 lg:grid-cols-2" : "space-y-4"
      }
    >
      {sessions &&
        sessions?.map((session) => (
          <SessionPlanCard
            status={session?.status!}
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

export default SessionPlan;
