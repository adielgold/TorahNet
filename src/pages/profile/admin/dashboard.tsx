import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar, Navbar } from "@/components";
import { FaCalendarAlt } from "react-icons/fa";
import SessionPlan from "@/components/SessionPlan/SessionPlan";
import {
  ProfileQuickLinkSection,
  HamburgerDashboard,
  SidebarSlider,
} from "@/components";
import SessionPhoneSection from "@/components/SessionPlan/SessionPhoneSection";
import { FaRegCircleQuestion } from "react-icons/fa6";
import withAuth from "@/components/withAuth/withAuth";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import { SessionWithUsers } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import LayoutWrapper from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ToggleButtonsComponent, { ToggleButtonItem } from "@/components/ToggleButtons/ToggleButtons";

const timeToggleItems: ToggleButtonItem[] = [
    {label: 'Today', value: 'DAY'},
    {label: 'This Week', value: 'WEEK'},
    {label: 'This Month', value: 'MONTH'}
]


const Profile = () => {
  const { user } = useUserStore();

  const supabase = createClient();

  const [sessions, setSessions] = useState<SessionWithUsers[] | []>([]);
  const [refreshSessions, setRefreshSessions] = useState<boolean>(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const handleTimeToggleChange = useCallback((newVal: string) => {
        console.log(newVal);
  },[]);

  return (
    <LayoutWrapper>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div style={{textAlign: 'center'}}>
        <ToggleButtonsComponent items={timeToggleItems} onChange={handleTimeToggleChange} defaultValue="DAY" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          {!sessionsLoading && sessions.length > 0 ? (
            <SessionPlan
              sessions={sessions}
              refreshSessions={() => setRefreshSessions(!refreshSessions)}
            />
          ) : (
            <>
              <Skeleton className="h-[120px] w-full mt-4" />
              <Skeleton className="h-[120px] w-full mt-2.5" />
              <Skeleton className="h-[120px] w-full mt-2.5" />
            </>
          )}
        </div>
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liked Articles</CardTitle>
            </CardHeader>
            <CardContent>
             
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sessions finished last month</CardTitle>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Favourite Topics</CardTitle>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default withAuth(Profile);
