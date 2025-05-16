import { stripe } from "@/lib/stripe";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createClient(req, res);

    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user?.id) {
      console.error("Auth Error:", authError);
      return res.status(401).json({ error: "Authentication failed" });
    }

    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    console.log("Fetching payments for teacher:", userData.user.id);
    // Get payments that haven't been withdrawn yet
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("teacher_id", userData.user.id)
      .eq("status", "completed")
      .eq("withdrawn", false)
      .lte("payout_due_date", new Date().toISOString())
      .order("payout_due_date", { ascending: true });

    if (paymentsError) {
      console.error("Payments Error:", paymentsError);
      return res.status(400).json({ error: "Failed to fetch payments" });
    }

    console.log("Found payments:", paymentsData.length);
    const totalPaymentSum = paymentsData.reduce(
      (sum, payment) => sum + (payment?.teacher_amount || 0),
      0
    );

    console.log("Total available:", totalPaymentSum, "Requested:", amount);
    if (totalPaymentSum < amount) {
      return res.status(400).json({
        error: "Insufficient funds",
        available: totalPaymentSum,
        requested: amount,
      });
    }

    const withdrawalUuid = uuidv4(); // Generate UUID for reference

    // Create withdrawal record
    const { data: withdrawalData, error: withdrawalError } = await supabase
      .from("withdrawals")
      .insert({
        transfer_id: withdrawalUuid, // Use UUID as transfer_id
        amount: amount,
        teacher_id: userData.user.id,
        status: "pending",
      })
      .select()
      .single();

    if (withdrawalError) {
      console.error("Withdrawal Creation Error:", withdrawalError);
      return res
        .status(400)
        .json({ error: "Failed to create withdrawal record" });
    }

    let remainingAmount = amount;
    const updatedPaymentIds = [];
    const paymentUpdates = [];

    for (const payment of paymentsData) {
      if (remainingAmount <= 0) break;

      const amountToWithdraw = Math.min(
        payment.teacher_amount,
        remainingAmount
      );
      remainingAmount -= amountToWithdraw;
      updatedPaymentIds.push(payment.id);
      paymentUpdates.push({
        amount: amountToWithdraw,
        payment_id: payment.id,
      });
    }

    console.log("Updating payments:", updatedPaymentIds);
    if (updatedPaymentIds.length > 0) {
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          withdrawn: true,
          withdrawal_id: withdrawalUuid, // Use the UUID here instead of the numeric ID
          withdrawn_at: new Date().toISOString(),
        })
        .in("id", updatedPaymentIds);

      if (updateError) {
        console.error("Payment Update Error:", updateError);
        // Rollback withdrawal
        await supabase
          .from("withdrawals")
          .delete()
          .eq("transfer_id", withdrawalUuid);
        return res.status(400).json({
          error: "Failed to update payments",
          details: updateError,
        });
      }
    }

    return res.status(200).json({
      message: "Transfer initiated. Funds will be processed shortly",
      withdrawalId: withdrawalUuid,
      updatedPayments: paymentUpdates,
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
