import { stripe } from "@/lib/stripe";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const supabase = createClient(req, res);

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log(error, "Error");
        return res.status(400).json({ error: error.message });
      }

      const { amount } = req.body;

      const { data: paymentDetailsData, error: paymentDetailsError } =
        await supabase
          .from("payment_details")
          .select("*")
          .eq("id", data?.user?.id as string)
          .single();

      if (paymentDetailsError) {
        console.log(paymentDetailsError, "Payment Details Error");
        return res.status(400).json({ error: paymentDetailsError.message });
      }

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("teacher_id", data?.user?.id as string)
        .eq("status", "completed")
        .lte("payout_due_date", new Date().toISOString());

      if (paymentsError) {
        console.log(paymentsError, "Payments Error");
        return res.status(400).json({ error: paymentsError.message });
      }

      const totalPaymentSum = paymentsData.reduce(
        (sum, payment) => sum + payment?.teacher_amount,
        0
      );

      if (totalPaymentSum < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }

      await stripe.transfers.create({
        currency: "usd",
        amount: amount * 100,
        metadata: {
          transferred_at: new Date().toISOString(),
          teacher_id: data?.user?.id,
        },
        destination: paymentDetailsData?.stripe_account_id,
      });

      res.status(200).json({
        message:
          "Transfer Initiated. Funds will be transferred to your account shortly",
      });
    } catch (error) {
      console.log(error, "Error");
      res.status(400).json({ error: "Failed To Initiate Transfer" });
    }
  }
}
