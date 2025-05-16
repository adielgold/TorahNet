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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

// Use a simpler type without the teacher relationship
type WithdrawalData = {
  id: number;
  created_at: string;
  amount: number | null;
  status: string | null;
  teacher_id: string | null;
  transfer_id: string | null;
  teacher_name?: string | null;
};

type GroupedWithdrawal = {
  teacher_id: string;
  teacher_name: string;
  total_amount: number;
  withdrawals: WithdrawalData[];
};

const Payments = () => {
  const [groupedWithdrawals, setGroupedWithdrawals] = useState<
    GroupedWithdrawal[]
  >([]);
  const [pendingConfirmations, setPendingConfirmations] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();

  const fetchWithdrawals = async () => {
    try {
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (withdrawalError) throw withdrawalError;

      if (!withdrawalData || withdrawalData.length === 0) {
        setGroupedWithdrawals([]);
        setLoading(false);
        return;
      }
      const teacherIds = Array.from(
        new Set(
          withdrawalData.map((w) => w.teacher_id).filter((id) => id !== null)
        )
      ) as string[];

      const { data: teacherData, error: teacherError } = await supabase
        .from("users")
        .select("id, name")
        .in("id", teacherIds);

      if (teacherError) {
        console.error("Error fetching teacher data:", teacherError);
      }

      // Group withdrawals by teacher
      const grouped = teacherIds.map((teacherId) => {
        const teacherWithdrawals = withdrawalData.filter(
          (w) => w.teacher_id === teacherId
        );
        const teacher = teacherData?.find((t) => t.id === teacherId);
        const totalAmount = teacherWithdrawals.reduce(
          (sum, w) => sum + (w.amount || 0),
          0
        );

        return {
          teacher_id: teacherId,
          teacher_name: teacher?.name || "N/A",
          total_amount: totalAmount,
          withdrawals: teacherWithdrawals.map((w) => ({
            ...w,
            teacher_name: teacher?.name || null,
          })),
        };
      });

      setGroupedWithdrawals(grouped);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  const handleConfirmPayment = async (withdrawalId: number) => {
    // Add to pending confirmations
    setPendingConfirmations((prev) => {
      const newSet = new Set(prev);
      newSet.add(withdrawalId);
      return newSet;
    });

    // Show toast with undo option
    toast({
      title: "Payment marked as confirmed",
      description: "This will be processed in 4 seconds",
      action: (
        <Button
          variant="outline"
          onClick={() => {
            setPendingConfirmations((prev) => {
              const newSet = new Set(prev);
              newSet.delete(withdrawalId);
              return newSet;
            });
          }}
        >
          Undo
        </Button>
      ),
    });

    // Debounce the confirmation
    setTimeout(async () => {
      // Check if the withdrawal is still pending confirmation
      setPendingConfirmations((prev) => {
        if (prev.has(withdrawalId)) {
          // Update the database
          const updateDB = async () => {
            try {
              const { error } = await supabase
                .from("withdrawals")
                .update({ status: "completed" })
                .eq("id", withdrawalId);

              if (error) throw error;

              // Refresh the withdrawals list
              fetchWithdrawals();
            } catch (error) {
              console.error("Error updating withdrawal:", error);
              toast({
                title: "Error",
                description: "Failed to confirm payment",
                variant: "destructive",
              });
            }
          };
          updateDB();

          // Remove from pending set
          const newSet = new Set(prev);
          newSet.delete(withdrawalId);
          return newSet;
        }
        return prev;
      });
    }, 4000);
  };

  useEffect(() => {
    Promise.all([fetchWithdrawals()]).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper>
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          <Button
            onClick={(e) => router.push("/profile/admin/teacher-stats")}
            variant="outline"
            className="hover:bg-gray-100"
          >
            View All Payments
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Accordion type="single" collapsible className="w-full">
              {groupedWithdrawals.map((group) => (
                <AccordionItem
                  key={group.teacher_id}
                  value={group.teacher_id}
                  className="border-b last:border-b-0"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex w-full justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {group.teacher_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {group.teacher_name}
                        </span>
                      </div>
                      <span className="text-right font-semibold text-green-600">
                        ${group.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">
                              Date
                            </TableHead>
                            <TableHead className="font-semibold">
                              Amount
                            </TableHead>
                            <TableHead className="font-semibold">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.withdrawals.map((withdrawal) => (
                            <TableRow
                              key={withdrawal.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="text-gray-600">
                                {typeof window !== "undefined"
                                  ? format(
                                      new Date(withdrawal.created_at),
                                      "MMM dd, yyyy"
                                    )
                                  : withdrawal.created_at.split("T")[0]}
                              </TableCell>
                              <TableCell className="font-medium text-gray-900">
                                ${withdrawal.amount?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    pendingConfirmations.has(withdrawal.id)
                                      ? "secondary"
                                      : "default"
                                  }
                                  className={`${
                                    pendingConfirmations.has(withdrawal.id)
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {pendingConfirmations.has(withdrawal.id)
                                    ? "Confirming..."
                                    : withdrawal.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() =>
                                    handleConfirmPayment(withdrawal.id)
                                  }
                                  variant="outline"
                                  className={`
                                    ${
                                      pendingConfirmations.has(withdrawal.id)
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                    }
                                    transition-colors
                                  `}
                                  disabled={pendingConfirmations.has(
                                    withdrawal.id
                                  )}
                                >
                                  {pendingConfirmations.has(withdrawal.id)
                                    ? "Processing..."
                                    : "Confirm Payment"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              {groupedWithdrawals.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-4">📭</div>
                  <p className="text-lg font-medium">No pending withdrawals</p>
                  <p className="text-sm">All payments have been processed</p>
                </div>
              )}
            </Accordion>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Payments;
