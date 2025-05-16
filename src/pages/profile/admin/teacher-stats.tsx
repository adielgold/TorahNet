import LayoutWrapper from "@/components/Layout";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/types/supabase";
// New type for teacher stats
type TeacherStats = {
  teacherId: string;
  teacherName: string | null;
  email: string | null;
  stripeConnected: boolean;
  totalEarnings: number;
  totalWithdrawn: number;
  availableToWithdraw: number;
  pendingAmount: number;
  lastWithdrawalDate: string | null;
  lastWithdrawalAmount: number;
};
const TeacherStatsTable = () => {
  const [teacherStats, setTeacherStats] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTeacherStats = async () => {
    try {
      const { data: teachersData, error: teachersError } = await supabase
        .from("users")
        .select(
          `
              id,
              name,
              email,
              payment_details (
                stripe_account_id,
                onboarding_completed
              )
            `
        )
        .eq("role", "teacher");

      if (teachersError) throw teachersError;

      const teacherIds = teachersData
        .map((w) => w.id)
        .filter((id) => id !== null) as string[];

      const stats = await Promise.all(
        teachersData.map(async (teacher) => {
          // Get completed payments only
          const { data: paymentsData } = await supabase
            .from("payments")
            .select("*")
            .eq("teacher_id", teacher.id)
            .eq("status", "completed") // Only count completed payments
            .order("created_at", { ascending: false });

          // Get pending payments
          const { data: pendingPayments } = await supabase
            .from("payments")
            .select("*")
            .eq("teacher_id", teacher.id)
            .eq("status", "onhold");

          // Get withdrawals
          const { data: withdrawalsData } = await supabase
            .from("withdrawals")
            .select("*")
            .eq("teacher_id", teacher.id)
            .eq("status", "completed");

          const totalEarnings = (paymentsData || []).reduce((sum, payment) => {
            return sum + (payment.teacher_amount || 0);
          }, 0);

          const pendingAmount = (pendingPayments || []).reduce(
            (sum, payment) => sum + (payment.teacher_amount || 0),
            0
          );

          const totalWithdrawn = (withdrawalsData || []).reduce(
            (sum, withdrawal) => sum + (withdrawal.amount || 0),
            0
          );

          const lastWithdrawal =
            withdrawalsData && withdrawalsData.length > 0
              ? withdrawalsData.sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )[0]
              : null;

          return {
            teacherId: teacher.id,
            teacherName: teacher.name,
            email: teacher.email,
            stripeConnected:
              teacher.payment_details?.onboarding_completed || false,
            totalEarnings,
            totalWithdrawn,
            availableToWithdraw: totalEarnings - totalWithdrawn,
            pendingAmount,
            lastWithdrawalDate: lastWithdrawal?.created_at || null,
            lastWithdrawalAmount: lastWithdrawal?.amount || 0,
          } as TeacherStats;
        })
      );

      setTeacherStats(stats);
    } catch (error) {
      console.error("Error fetching teacher stats:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchTeacherStats()]).finally(() => setLoading(false));
  }, []);
  return (
    <LayoutWrapper>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Payment Management</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Earnings Till Date</TableHead>
              <TableHead>Total Withdrawn</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherStats.map((stats) => (
              <TableRow key={stats.teacherId}>
                <TableCell className="font-medium">
                  {stats.teacherName || "Unknown"}
                </TableCell>
                <TableCell>{stats.email || "No email"}</TableCell>
                <TableCell>
                  <Badge
                    variant={stats.stripeConnected ? "default" : "destructive"}
                    className={stats.stripeConnected ? "bg-green-500" : ""}
                  >
                    {stats.stripeConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  ${stats.totalEarnings.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium text-red-600">
                  ${stats.totalWithdrawn.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  ${stats.availableToWithdraw.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium text-orange-600">
                  ${stats.pendingAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </LayoutWrapper>
  );
};

export default TeacherStatsTable;
