// pages/api/stripe/webhook.js
import { stripe } from "@/lib/stripe";
import createClient from "@/utils/supabase/serviceApiClient";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res);

  const signature = req.headers["stripe-signature"];

  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const checkout = event.data.object;
        console.log(checkout, "checkout");
        const { data: sessionD } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", checkout.metadata?.sessionId)
          .single();
        await supabase
          .from("sessions")
          .update({ status: "scheduled" })
          .eq("id", sessionD?.id);
        const { data, error } = await supabase
          .from("payments")
          .insert({
            payment_intent_id: checkout.payment_intent,
            amount: checkout?.amount_total
              ? Number((checkout?.amount_total / 100)?.toFixed(2))
              : 0,
            session_id: sessionD?.id,
            teacher_id: sessionD?.teacher_id,
            student_id: sessionD?.student_id,
            status: "onhold",
            payout_due_date: new Date(
              new Date(sessionD.scheduledAt).getTime() + 7 * 24 * 60 * 60 * 1000
            ),
            teacher_amount: Number(
              (((checkout?.amount_total ?? 0) / 100) * 0.9)?.toFixed(2)
            ),
          })
          .select("*");
        console.log(data, error, "Payment Data");
        break;
      case "account.updated":
        const account = event.data.object;

        if (
          account.charges_enabled &&
          account?.requirements?.currently_due?.length === 0 &&
          account?.requirements?.pending_verification?.length === 0
        ) {
          // Account is fully onboarded and ready to accept payments
          await supabase
            .from("payment_details")
            .update({
              onboarding_completed: true,
              stripe_account_id: account.id,
            })
            .eq("stripe_account_id", account.id);

          console.log(`Teacher ${account.id} completed onboarding.`);
        } else if (!account.charges_enabled) {
          await supabase
            .from("payment_details")
            .update({
              onboarding_completed: false,
              disabled_reason: account?.requirements?.disabled_reason,
            })
            .eq("stripe_account_id", account.id);
        }
        break;
      case "transfer.created":
        const transfer = event.data.object;

        await supabase
          .from("withdrawals")
          .insert({
            transfer_id: transfer.id,
            amount: transfer.amount / 100,
            teacher_id: transfer?.metadata?.teacher_id,
            status: "completed",
          })
          .select("*");

        break;
      // Handle other event types if needed
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
