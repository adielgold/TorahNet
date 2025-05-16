import { getPayPalAccessToken } from "@/lib/paypalAccessToken";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabase = createClient(req, res);
  const BASE_URL = process.env.PAYPAL_BASE_URL;

  try {
    const { token, sessionId, teacherId, studentId } = req.body;

    // First verify session exists
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error("Session not found:", sessionError);
      return res.status(404).json({ error: "Session not found" });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const response = await fetch(
      `${BASE_URL}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const paypalData = await response.json();

    // If capture fails, return early without updating database
    if (!response.ok) {
      console.error("PayPal Capture Failed:", {
        status: response.status,
        data: paypalData,
      });
    }

    // Only proceed with database updates if capture was successful
    if (paypalData.status === "COMPLETED") {
      const checkout = paypalData.purchase_units[0].payments.captures[0];
      try {
        // First check if payment already exists
        const { data: existingPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("payment_intent_id", checkout.id)
          .single();

        if (existingPayment) {
          // Payment already processed, return success
          return res.status(200).json({
            success: true,
            message: "Payment already processed",
          });
        }

        // Update session status
        const { data: updatedSession, error: updateError } = await supabase
          .from("sessions")
          .update({
            status: "scheduled",
          })
          .eq("id", sessionId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Create payment record
        const { data: paymentData, error: paymentError } = await supabase
          .from("payments")
          .insert({
            payment_intent_id: checkout.id,
            amount: Number(checkout.amount.value),

            session_id: sessionId,
            teacher_id: teacherId,
            student_id: studentId,
            status: "onhold",
            payout_due_date: new Date(
              new Date(sessionData.scheduledAt).getTime() +
                7 * 24 * 60 * 60 * 1000
            ),
            // status: "completed",
            // payout_due_date: new Date(),
            teacher_amount: Number(
              checkout.seller_receivable_breakdown.net_amount.value
            ),
          })
          .select();
        console.log(paymentData, "paymentData");

        if (paymentError) throw paymentError;

        return res.status(200).json({
          success: true,
        });
      } catch (dbError) {
        console.error("Database update failed:", dbError);
        // Could add rollback logic here if needed
        return res.status(500).json({
          error: "Failed to update database",
          details: dbError,
        });
      }
    } else {
      console.error("Unexpected PayPal status:", paypalData.status);
      return res.status(400).json({
        error: "Payment not completed",
        status: paypalData.status,
      });
    }
  } catch (error) {
    console.error("Capture order error:", error);
    return res.status(500).json({
      error: "Failed to process capture",
      details: error,
    });
  }
}
