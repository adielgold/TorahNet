// pages/api/stripe/checkout.js
import { stripe } from "@/lib/stripe";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const supabase = createClient(req, res);

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        res.status(400).json({ error: "Session ID is required" });
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select(
          `*,
             teacher:teacher_id(
              *,
              payment_details(*)
             )
            `,
        )
        .eq("id", sessionId)
        .single();

      if (!sessionData || sessionError) {
        res.status(404).json({ error: "Session not found" });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Video session with ${sessionData?.teacher?.name}`,
                description: `This price includes a 5% platform fee And the Stripe Payment Processing Fee`,
                ...(sessionData?.teacher?.image_url && {
                  images: [sessionData?.teacher?.image_url],
                }),
              },
              unit_amount: Math.round(
                sessionData?.teacher?.payment_details?.hourly_rate * 1.05 * 100,
              ),
            },
            quantity: 1,
          },
        ],
        metadata: {
          sessionId: sessionId,
          teacherId: sessionData?.teacher_id,
          studentId: data?.user?.id,
          platformFee: Math.round(
            sessionData?.teacher?.payment_details?.hourly_rate * 0.05 * 100,
          ),
        },
        success_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/profile/dashboard?sessionId=${sessionId}&payment_success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/profile/dashboard?sessionId=${sessionId}&payment_success=false`,
      });

      res.status(200).json({
        url: stripeSession.url,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }

    // try {
    //   const { sessionId } = req.body;

    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount * 100, // Amount in cents
    //     currency: "usd",
    //     application_fee_amount: amount * 0.05 * 100, // Platform fee
    //     // transfer_data: {
    //     //   destination: teacher.stripe_account_id,
    //     // },
    //   });

    //   // Store payment details in Supabase
    //   await supabase.from("payments").insert([
    //     {
    //       student_id: studentId,
    //       teacher_id: teacherId,
    //       session_id: sessionId,
    //       amount,
    //       payment_intent_id: paymentIntent.id,
    //     },
    //   ]);
  }
  //       res.status(200).json({ clientSecret: paymentIntent.client_secret });
  //     } catch (error: any) {
  //       res.status(400).json({ error: error.message });
  //     }
  //   }
}
