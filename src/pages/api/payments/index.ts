import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const supabase = createClient(req, res);

    const { data, error } = await supabase.auth.getUser();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data?.user?.id)
      .single();

    if (error || userError) {
      return res
        .status(400)
        .json({ error: error?.message || userError?.message });
    }

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .select(
        `
        *,
        student:student_id (
          name
        ),
        teacher:teacher_id (
          name
        )
      `
      )
      .or(`teacher_id.eq.${data?.user?.id},student_id.eq.${data?.user?.id}`);

    if (paymentError) {
      return res.status(400).json({ error: paymentError.message });
    }

    if (userData?.role === "teacher") {
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("teacher_id", data?.user?.id as string)
        .eq("status", "completed");

      if (withdrawalsError) {
        return res.status(400).json({ error: withdrawalsError.message });
      }

      const currentDate = new Date();
      const totalAmountAvailableForWithdrawal = paymentData
        .filter(
          (payment) =>
            new Date(payment.payout_due_date) <= currentDate &&
            payment.status === "completed"
        )
        .reduce((sum, payment) => sum + payment.teacher_amount, 0);

      const totalAmountOnHold = paymentData
        .filter((payment) => payment.status === "onhold")
        .reduce((sum, payment) => sum + payment.teacher_amount, 0);

      const totalAmoundOnHoldLength = paymentData.filter(
        (payment) => payment.status === "onhold"
      );

      const totalWithdrawnAmount = withdrawalsData.reduce(
        (sum, withdrawal) => sum + withdrawal.amount,
        0
      );

      const remainingBalance =
        Math.floor(
          (totalAmountAvailableForWithdrawal - totalWithdrawnAmount) * 100
        ) / 100;

      const paymentsWithTimeLeft = paymentData
        ?.filter((val) => val?.status !== "onhold")
        .map((payment) => {
          const payoutDueDate = new Date(payment.payout_due_date);
          const timeDiff = payoutDueDate.getTime() - currentDate.getTime();
          let timeLeft;

          if (timeDiff > 0) {
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            if (daysLeft > 1) {
              timeLeft = `${daysLeft} days left`;
            } else if (daysLeft === 1) {
              timeLeft = "will clear tomorrow";
            } else {
              timeLeft = "will clear later today";
            }
          } else {
            timeLeft = "cleared";
          }

          return {
            ...payment,
            timeLeft,
            studentName: payment.student?.name || "Unknown",
          };
        });

      return res.status(200).json({
        totalAmountAvailableForWithdrawal,
        payments: paymentsWithTimeLeft,
        totalAmountOnHold,
        totalAmoundOnHoldLength: totalAmoundOnHoldLength?.length,
        totalWithdrawnAmount,
        remainingBalance,
        completedWithdrawals: withdrawalsData,
      });
    } else {
      const totalSpent = paymentData.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      const totalAmountOnHold = paymentData
        .filter((payment) => payment.status === "onhold")
        .reduce((sum, payment) => sum + payment.amount, 0);

      const totalAmoundOnHoldLength = paymentData.filter(
        (payment) => payment.status === "onhold"
      );

      const totalAmountRefunded = paymentData
        .filter((payment) => payment.status === "refunded")
        .reduce((sum, payment) => sum + payment.amount, 0);

      return res.status(200).json({
        totalSpent,
        totalAmountOnHold,
        totalAmoundOnHoldLength: totalAmoundOnHoldLength?.length,
        totalAmountRefunded,
        payments: paymentData,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
