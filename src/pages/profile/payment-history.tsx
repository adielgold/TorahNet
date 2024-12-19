"use client";

import NavbarWrapper from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useUserStore } from "@/stores/userStore";
import { Payments } from "@/types";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  WalletIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface WithDrawalFormProps {
  amount: number;
}

export default function PaymentHistory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithDrawalFormProps>();

  const { user } = useUserStore();

  const [paymentData, setPaymentData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("/api/payments");
        setPaymentData(data);
        console.log(data, "Data");
      } catch (error) {
        console.error(error, "Error");
        toast({
          title: "Error",
          description: "An error occurred while fetching payments",
        });
      }
    };
    fetchPayments();
  }, [user]);

  const onSubmit: SubmitHandler<WithDrawalFormProps> = async (data) => {
    // Handle the form submission
    try {
      const { data: transferData } = await axios.post("/api/stripe/transfer", {
        amount: +data.amount,
      });

      setDialogOpen(false);
      toast({
        title: "Success",
        description: transferData?.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error ?? "An error occurred",
      });
    }
  };

  return (
    <>
      {user?.role === "teacher" ? (
        <NavbarWrapper>
          <div className="container mx-auto p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    Current Balance
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${paymentData?.remainingBalance}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available for withdrawal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    Payment For Active Sessions
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2">
                    ${paymentData?.totalAmountOnHold}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payments for {paymentData?.totalAmoundOnHoldLength} for
                    active sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    Total Withdrawn till date
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2">
                    ${paymentData?.totalWithdrawnAmount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total amount withdrawn till date
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    Quick Actions
                  </CardTitle>
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
                      <Button
                        className="w-full mt-2 bg-primary-blue"
                        size="lg"
                        disabled={paymentData?.remainingBalance < 50}
                      >
                        Withdraw Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Withdraw Funds</DialogTitle>
                        <DialogDescription>
                          Enter the amount you would like to withdraw. The
                          minimum withdrawal amount is $50.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="amount">Amount</label>
                            <Input
                              id="amount"
                              placeholder="Enter amount"
                              type="number"
                              {...register("amount", {
                                required: "Amount is required",
                                min: {
                                  value: 0,
                                  message: "Minimum withdrawal amount is $0",
                                },
                                max: {
                                  value: paymentData?.remainingBalance,
                                  message: `Amount cannot exceed ${paymentData?.remainingBalance}`,
                                },
                              })}
                            />
                            {errors.amount && (
                              <p className="text-red-500">
                                {errors?.amount?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Confirm Withdrawal</Button>
                        </DialogFooter>
                      </form>
                      {/* <DialogFooter>
                    <Button type="submit">Confirm Withdrawal</Button>
                  </DialogFooter> */}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all your past transactions and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData?.payments?.map((payment: any) => (
                      <TableRow key={payment?.id}>
                        <TableCell>
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {/* {payment.teacher_amount > 0 ? (
                        <ArrowDownIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4 text-blue-500" />
                      )} */}
                          {payment?.studentName}
                        </TableCell>
                        <TableCell
                          className={
                            payment?.status === "refunded"
                              ? "text-red-500 font-bold"
                              : payment?.status === "onhold"
                              ? "text-primary-blue font-bold"
                              : "text-green-500 font-bold"
                          }
                        >
                          ${Math.abs(payment.teacher_amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={"default"}
                            className={
                              payment?.status === "refunded"
                                ? "bg-red-500"
                                : payment?.status === "onhold"
                                ? "bg-primary-blue"
                                : "bg-green-500"
                            }
                          >
                            {payment?.status === "onhold"
                              ? "Active"
                              : payment?.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-primary-blue font-medium">
                            {payment?.status === "refunded"
                              ? "-"
                              : payment.timeLeft}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>
                  View all your past withdrawals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData?.completedWithdrawals?.map(
                      (withdrawal: any) => (
                        <TableRow key={withdrawal?.id}>
                          <TableCell>
                            {new Date(
                              withdrawal?.created_at
                            ).toLocaleDateString()}
                          </TableCell>

                          <TableCell
                            className={
                              withdrawal?.amount > 0
                                ? "text-red-600 font-bold"
                                : "text-blue-600 font-bold"
                            }
                          >
                            -${withdrawal?.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                              {withdrawal?.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </NavbarWrapper>
      ) : (
        <NavbarWrapper>
          <div className="container mx-auto p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    Total Spent
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${paymentData?.totalSpent}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total amount spent on sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    Payment For Active Sessions
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2">
                    ${paymentData?.totalAmountOnHold}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payments for {paymentData?.totalAmoundOnHoldLength} for
                    active sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    Total Amount Refunded
                  </CardTitle>
                  <WalletIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2">
                    ${paymentData?.totalAmountRefunded}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Excluding 5% platform fee
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all your past transactions and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData?.payments?.map((payment: any) => (
                      <TableRow key={payment?.id}>
                        <TableCell>
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {payment?.teacher?.name}
                        </TableCell>
                        <TableCell
                          className={
                            payment?.status === "refunded"
                              ? "text-yellow-500 font-bold"
                              : payment?.status === "onhold"
                              ? "text-primary-blue font-bold"
                              : "text-green-500 font-bold"
                          }
                        >
                          ${Math.abs(payment?.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={"default"}
                            className={
                              payment?.status === "refunded"
                                ? "bg-yellow-500"
                                : payment?.status === "onhold"
                                ? "bg-primary-blue"
                                : "bg-green-500"
                            }
                          >
                            {payment?.status === "onhold"
                              ? "Active"
                              : payment?.status}
                          </Badge>
                          {/* <span
                            className={
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
                            }
                          >
                            {payment?.status}
                          </span> */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </NavbarWrapper>
      )}
    </>
  );
}
