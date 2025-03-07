import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const supabase = createClient(req, res);
    const { amount } = req.body;

    console.log("Transfer Request - Amount:", amount);

    // Get authenticated user
    const { data, error } = await supabase.auth.getUser();
    console.log("Auth Check:", {
      userId: data?.user?.id,
      error,
    });

    if (error) {
      console.log("Auth Error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Get teacher's payment details
    const { data: paymentDetailsData, error: paymentDetailsError } =
      await supabase
        .from("payment_details")
        .select("*")
        .eq("id", data?.user?.id)
        .single();

    console.log("Payment Details Lookup:", {
      found: !!paymentDetailsData,
      paypalEmail: paymentDetailsData?.stripe_account_id,
      error: paymentDetailsError,
    });

    if (paymentDetailsError) {
      console.log("Payment Details Error:", paymentDetailsError);
      return res.status(400).json({ error: paymentDetailsError.message });
    }

    // Get completed payments for teacher
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("teacher_id", data?.user?.id)
      .eq("status", "completed")
      .lte("payout_due_date", new Date().toISOString());

    console.log("Completed Payments Query:", {
      count: paymentsData?.length,
      error: paymentsError,
    });

    if (paymentsError) {
      console.log("Payments Error:", paymentsError);
      return res.status(400).json({ error: paymentsError.message });
    }

    // Calculate total available amount
    const totalPaymentSum = paymentsData.reduce(
      (sum, payment) => sum + payment.teacher_amount,
      0,
    );

    console.log("Payment Calculation:", {
      totalAvailable: totalPaymentSum,
      requestedAmount: amount,
      sufficient: totalPaymentSum >= amount,
    });

    if (totalPaymentSum < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    console.log("PayPal Access Token Obtained");

    // Create PayPal payout
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/payments/payouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sender_batch_header: {
            sender_batch_id: `PAYOUT_${Date.now()}`,
            email_subject: "You have a payout!",
            email_message:
              "You have received a payout for your teaching sessions",
          },
          items: [
            {
              recipient_type: "PAYPAL_ID",
              amount: {
                value: amount,
                currency: "USD",
              },
              receiver: paymentDetailsData?.stripe_account_id,
              note: "Payout for teaching sessions",
              sender_item_id: `PAYOUT_ITEM_${Date.now()}`,
            },
          ],
        }),
      },
    );

    const payoutData = await response.json();
    console.log("PayPal Payout Response:", {
      status: response.status,
      data: payoutData,
    });

    if (!response.ok) {
      console.error("PayPal Payout Failed:", payoutData);
      return res.status(response.status).json({
        error: "Failed to initiate transfer",
        details: payoutData,
      });
    }

    // Update payments as paid out
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        transfer_id: payoutData.batch_header.payout_batch_id,
        amount: amount,
        teacher_id: data?.user?.id,
      })
      .select("*");

    console.log("Payments Update:", {
      count: paymentsData.length,
      error: updateError,
    });

    res.status(200).json({
      message:
        "Transfer Initiated. Funds will be transferred to your account shortly",
      payout: payoutData,
    });
  } catch (error: any) {
    console.error("Transfer Error:", {
      message: error.message,
      error,
      stack: error.stack,
    });
    res.status(400).json({ error: "Failed To Initiate Transfer" });
  }
}
