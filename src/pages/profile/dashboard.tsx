import React, { useEffect, useState } from "react";
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

const likedArticles = [
  {
    title: "Introduction to React Hooks",
    description:
      "Learn the basics of React Hooks and how they can simplify your code.",
  },
  {
    title: "Advanced TypeScript Techniques",
    description:
      "Discover advanced TypeScript features to improve your development workflow.",
  },
];

const finishedSessions = [
  {
    title: "JavaScript Fundamentals",
    description:
      "A comprehensive overview of JavaScript basics and core concepts.",
  },
  {
    title: "CSS Grid Layout",
    description: "Master the powerful CSS Grid system for modern web layouts.",
  },
];

const favoriteTopics = [
  {
    title: "Frontend Development",
    description:
      "Explore the latest trends and tools in frontend web development.",
  },
  {
    title: "Machine Learning",
    description: "Dive into the fascinating world of machine learning and AI.",
  },
];

const Profile = () => {
  const { user } = useUserStore();

  const supabase = createClient();

  const [sessions, setSessions] = useState<SessionWithUsers[] | []>([]);
  const [refreshSessions, setRefreshSessions] = useState<boolean>(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      let query = supabase.from("sessions").select(`
                *,
                student:users!sessions_student_id_fkey(id, name, email,image_url),  
                teacher:users!sessions_teacher_id_fkey(id, name, email,image_url) 
            `);

      if (user?.role === "student") {
        query = query.eq("student_id", user.id);
      } else if (user?.role === "teacher") {
        query = query.eq("teacher_id", user?.id);
      }

      // Filter for future sessions and those within the past hour
      query = query
        .eq("status", "scheduled")
        .gte("scheduledAt", oneHourAgo.toISOString())
        .order("scheduledAt", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setSessionsLoading(false);

      return data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error fetching sessions",
        description: "Please try again later",
      });
      setSessionsLoading(false);

      return [];
    }
  };

  useEffect(() => {
    fetchSessions().then((data) => {
      setSessions(data as SessionWithUsers[]);
    });
  }, [refreshSessions]);

  return (
    <LayoutWrapper>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <p className="text-lg font-semibold text-gray-700">
          Sessions Planned: {sessions?.length}
        </p>
        <Link href="/profile/session-history">
          <Button className="bg-darkblueui">See History</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-2/3">
          {!sessionsLoading && sessions.length > 0 ? (
            <SessionPlan
              sessions={sessions}
              refreshSessions={() => setRefreshSessions(!refreshSessions)}
            />
          ) : (
            <>
              <Skeleton className="mt-4 h-[120px] w-full" />
              <Skeleton className="mt-2.5 h-[120px] w-full" />
              <Skeleton className="mt-2.5 h-[120px] w-full" />
            </>
          )}
        </div>
        <div className="w-full space-y-6 lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Liked Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {likedArticles.map((article, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sessions finished last month</CardTitle>
            </CardHeader>
            <CardContent>
              {finishedSessions.map((session, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600">{session.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Favourite Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteTopics.map((topic, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="flex-1 h-full flex items-start justify-start mx-4 sm:mx-0">
        <div className="flex flex-col h-full sm:mt-12 mt-6 sm:ml-4">
          <h1 className="text-darkblueui text-3xl font-bold">Dashboard</h1>
          <div className="sm:mt-14 mt-7">
            <div className="text-4xl">
              <FaCalendarAlt className="text-darkblueui" />
            </div>
            <div className="flex items-center  mt-5 justify-between min-w-full lg:min-w-[685px]">
              <p className="text-darkblueui text-2xl sm:text-lg font-bold">
                Sessions Planned:
              </p>
              <Link
                href="/profile/session-history"
                className="text-sm font-medium px-2.5 py-2 rounded-full bg-[#D7E3F4] justify-center items-center hidden sm:flex"
              >
                See history
              </Link>
            </div>
          </div>


          {!sessionsLoading && sessions?.length > 0 ? (
            <>
              <div className="flex-col w-1/4 ml-3 hidden sm:flex">
                <SessionPlan
                  sessions={sessions}
                  refreshSessions={() => setRefreshSessions(!refreshSessions)}
                />
              </div>
              <div className="flex sm:hidden flex-col w-3/4 h-full">
                <SessionPhoneSection
                  sessions={sessions}
                  refreshSessions={() => setRefreshSessions(!refreshSessions)}
                />
              </div>
            </>
          ) : sessionsLoading ? (
            <>
              <Skeleton className="h-[60px] w-3/4 sm:w-full mt-4" />
              <Skeleton className="h-[60px] w-3/4 sm:w-full mt-2.5" />
              <Skeleton className="h-[60px] w-3/4 sm:w-full mt-2.5" />
            </>
          ) : (
            <p className="text-lg font-bold mt-4">No sessions planned</p>
          )}
        </div>
        <div className="flex-col w-full h-full justify-center items-end mt-8 mr-10 hidden sm:flex">
          <ProfileQuickLinkSection />
        </div>
      </div> */}

      {/* <section className="w-full min-h-screen flex flex-col">
        <div className="hidden sm:flex">
          <Navbar />
        </div>
        <div className="flex sm:hidden justify-between items-center bg-white w-full min-h-20 shadowprofile px-4">
          <HamburgerDashboard />
          <button className="px-3.5 py-1.5 rounded-full bg-blueui flex justify-center items-center mt-4 hover:bg-dark">
            <FaRegCircleQuestion className="text-sm mt-0.5 question-icon" />
            <span className="text-sm text-white ml-1 font-light">Help</span>
          </button>
        </div>
        <div className="flex w-full">
          <div className="hidden sm:flex">
            <Sidebar />
          </div>
          
        </div>
        <div className="sm:hidden bottom-0 absolute left-0 w-full ">
          <Navbar />
        </div>
      </section> */}
    </LayoutWrapper>
  );
};

export default withAuth(Profile);
