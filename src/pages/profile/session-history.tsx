// import { HamburgerDashboard, Navbar, Sidebar } from "@/components";
// import NavbarWrapper from "@/components/Navbar";
// import SessionPhoneSection from "@/components/SessionPlan/SessionPhoneSection";
// import SessionPlan from "@/components/SessionPlan/SessionPlan";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/components/ui/use-toast";
// import withAuth from "@/components/withAuth/withAuth";
// import { useUserStore } from "@/stores/userStore";
// import { SessionWithUsers } from "@/types";
// import { createClient } from "@/utils/supabase/client";
// import { useEffect, useState } from "react";
// import { FaRegCircleQuestion } from "react-icons/fa6";

// const SessionHistory: React.FC = () => {
//   const { user } = useUserStore();

//   const supabase = createClient();

//   const [sessions, setSessions] = useState<SessionWithUsers[] | []>([]);
//   const [refreshSessions, setRefreshSessions] = useState<boolean>(false);
//   const [sessionsLoading, setSessionsLoading] = useState(true);

//   const filters = [
//     "All",
//     "Payment Pending",
//     "Scheduled",
//     "Completed",
//     "Cancelled",
//   ];

//   const [selectedFilter, setSelectedFilter] = useState<string>("All");

//   const { toast } = useToast();

//   const fetchSessions = async () => {
//     try {
//       setSessionsLoading(true);

//       const now = new Date();
//       const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

//       let query = supabase.from("sessions").select(`
//                 *,
//                 student:users!sessions_student_id_fkey(id, name, email,image_url),
//                 teacher:users!sessions_teacher_id_fkey(id, name, email,image_url)
//             `);

//       if (user?.role === "student") {
//         query = query.eq("student_id", user.id);
//       } else if (user?.role === "teacher") {
//         query = query.eq("teacher_id", user?.id);
//       }

//       // Filter for future sessions and those within the past hour
//       query = query.order("scheduledAt", { ascending: true });

//       const { data, error } = await query;

//       if (error) {
//         throw error;
//       }

//       setSessionsLoading(false);

//       return data;
//     } catch (error) {
//       console.error("Error fetching sessions:", error);
//       toast({
//         title: "Error fetching sessions",
//         description: "Please try again later",
//       });
//       setSessionsLoading(false);

//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchSessions().then((data) => {
//       setSessions(data as SessionWithUsers[]);
//     });
//   }, []);

//   return (
//     <NavbarWrapper>
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Session History
//         </h1>
//         <div className="max-w-[250px] w-full mb-4">
//           <Select
//             onValueChange={(val) => setSelectedFilter(val)}
//             value={selectedFilter}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Filter By Status" />
//             </SelectTrigger>
//             <SelectContent>
//               {filters.map((option) => {
//                 return (
//                   <SelectItem key={option} value={option}>
//                     {option}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <p className="text-lg font-semibold text-gray-700">
//           Total Sessions Planned: {sessions?.length}
//         </p>
//       </div>

//       {!sessionsLoading && sessions.length > 0 ? (
//         <SessionPlan
//           sessions={sessions}
//           refreshSessions={() => setRefreshSessions(!refreshSessions)}
//           fromHistory
//         />
//       ) : null}
//     </NavbarWrapper>
//   );
// };

// export default withAuth(SessionHistory);

import { HamburgerDashboard, Navbar, Sidebar } from "@/components";
import NavbarWrapper from "@/components/Navbar";
import SessionPhoneSection from "@/components/SessionPlan/SessionPhoneSection";
import SessionPlan from "@/components/SessionPlan/SessionPlan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import withAuth from "@/components/withAuth/withAuth";
import { useUserStore } from "@/stores/userStore";
import { SessionWithUsers } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegCircleQuestion } from "react-icons/fa6";

const SessionHistory: React.FC = () => {
  const { user } = useUserStore();

  const supabase = createClient();

  const [sessions, setSessions] = useState<SessionWithUsers[] | []>([]);
  const [refreshSessions, setRefreshSessions] = useState<boolean>(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const filters = [
    "All",
    "Payment Pending",
    "Scheduled",
    "Finished",
    "Cancelled",
  ];

  const [selectedFilter, setSelectedFilter] = useState<string>("All");

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

      query = query.not("status", "is", null);

      if (selectedFilter !== "All") {
        query = query.eq(
          "status",
          selectedFilter.toLowerCase().replace(" ", "_")
        );
      }

      query = query.order("scheduledAt", { ascending: true });

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
  }, [selectedFilter, refreshSessions]);

  return (
    <NavbarWrapper>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Session History
        </h1>
        <div className="max-w-[250px] w-full mb-4">
          <Select
            onValueChange={(val) => setSelectedFilter(val)}
            value={selectedFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
              {filters.map((option) => {
                return (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-lg font-semibold text-gray-700">
          Total Sessions {selectedFilter !== "All" && selectedFilter} :{" "}
          {sessions?.length}
        </p>
      </div>

      {sessionsLoading && (
        <div className="w-full flex items-center justify-center mt-4">
          <Loader className="w-8 h-8 animate-spin text-primary-blue" />
        </div>
      )}

      {!sessionsLoading && sessions.length > 0 && (
        <SessionPlan
          sessions={sessions}
          refreshSessions={() => setRefreshSessions(!refreshSessions)}
          fromHistory
        />
      )}

      {!sessionsLoading && sessions.length === 0 && (
        <div className="flex items-center w-full">
          <FaRegCircleQuestion className="w-8 h-8 text-gray-400" />
          <p className=" text-gray-400 ml-3">
            No sessions found for the selected filter
          </p>
        </div>
      )}
    </NavbarWrapper>
  );
};

export default withAuth(SessionHistory);
