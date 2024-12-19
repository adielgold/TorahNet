// pages/api/stripe/refund.js
import { stripe } from "@/lib/stripe";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

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

    // Initiate Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.payment_intent_id,
      amount: Math.round(payment?.amount * 0.95 * 100), // Refund minus platform fee
    });

    await supabase
      .from("sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId);

    await supabase
      .from("payments")
      .update({ status: "refunded", refund_id: refund.id })
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
