import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", "POST")
      .status(405)
      .send("Method Not Allowed");
  }

  const { sessionId } = req.body;
  const supabase = createClient(req, res);

  const { data: userData, error } = await supabase.auth.getUser();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    // Fetch payment details from your database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    console.log(payment, "paymentData");
    const teacherId = payment?.teacher_id;

    const { data: teacher, error: teacherError } = await supabase
      .from("payment_details")
      .select("*")
      .eq("id", teacherId)
      .single();

    console.log(teacher, "teacherData");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const accessToken = await getPayPalAccessToken(teacher?.stripe_account_id);

    // Validate cancellation timing
    const bookingTime = new Date(payment.created_at).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - bookingTime) / (1000 * 60 * 60); // in hours

    if (timeDifference > 24) {
      return res.status(400).json({
        error:
          "Refund not eligible. Cancellation must occur within 24 hours of booking. Please contact support for assistance.",
      });
    }

    // Initiate PayPal refund
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/payments/captures/${payment.payment_intent_id}/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: {
            value: (Math.round(payment.amount * 0.95 * 100) / 100).toString(),
            currency_code: "USD",
          },
        }),
      },
    );

    const refundData = await response.json();

    console.log(refundData, "refundData");

    if (!response.ok) {
      throw new Error(
        `PayPal Error: ${refundData.message || "Unknown error"} (Debug ID: ${refundData.debug_id})`,
      );
    }

    await supabase
      .from("sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId);

    await supabase
      .from("payments")
      .update({ status: "refunded", refund_id: refundData.id })
      .eq("session_id", sessionId);

    res.status(200).json({
      success: true,
      message:
        "Your Session Has Been Cancelled And Your Amount will be refunded in short",
    });
  } catch (error: any) {
    console.error(error.message, error, "Error");
    res.status(500).json({ error: error.message });
  }
}
