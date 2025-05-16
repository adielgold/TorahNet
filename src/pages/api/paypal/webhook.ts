// import { NextApiRequest, NextApiResponse } from "next";
// import createClient from "@/utils/supabase/api";
// import { buffer } from "micro";
// import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// async function verifyPayPalWebhook(
//   body: string,
//   headers: { [key: string]: string | string[] | undefined },
// ): Promise<boolean> {
//   try {
//     const BASE_URL = process.env.PAYPAL_BASE_URL;

//     const accessToken = await getPayPalAccessToken();

//     // Verify webhook signature
//     const verifyResponse = await fetch(
//       `${BASE_URL}/v1/notifications/verify-webhook-signature`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({
//           auth_algo: headers["paypal-auth-algo"],
//           cert_url: headers["paypal-cert-url"],
//           transmission_id: headers["paypal-transmission-id"],
//           transmission_sig: headers["paypal-transmission-sig"],
//           transmission_time: headers["paypal-transmission-time"],
//           webhook_id: process.env.PAYPAL_WEBHOOK_ID,
//           webhook_event: JSON.parse(body),
//         }),
//       },
//     );

//     const verifyData = await verifyResponse.json();
//     return verifyData.verification_status === "SUCCESS";
//   } catch (error) {
//     console.error("Webhook verification failed:", error);
//     return false;
//   }
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const rawBody = await buffer(req);
//     const strBody = rawBody.toString();

//     const isValid = await verifyPayPalWebhook(strBody, req.headers);
//     if (!isValid) {
//       return res.status(400).json({ error: "Invalid webhook signature" });
//     }

//     const event = JSON.parse(strBody);
//     // console.log("Webhook Event:", JSON.stringify(event, null, 2));
//     // console.log("Event Type:", event.event_type);
//     // console.log("Resource:", event.resource);

//     const supabase = createClient(req, res);

//     // Handle different event types
//     switch (event.event_type) {
//       //   case "CHECKOUT.ORDER.APPROVED": {
//       //     const order = event.resource;
//       //     console.log("Order Approved:", order);

//       //     // Extract custom_id from the first purchase unit
//       //     const customId = order.purchase_units[0]?.custom_id;
//       //     if (!customId) {
//       //       console.error("No custom_id found in order");
//       //       return res.status(400).json({ error: "No custom_id found" });
//       //     }

//       //     const [sessionId, teacherId, studentId] = customId.split("|");

//       //     console.log("Parsed IDs:", {
//       //       sessionId,
//       //       teacherId,
//       //       studentId,
//       //       orderId: order.id,
//       //     });

//       //     const { data: sessionData, error: sessionError } = await supabase
//       //       .from("sessions")
//       //       .select("*")
//       //       .eq("id", sessionId);
//       //     console.log("Webhook - Found session:", sessionData);

//       //     console.log("Session Update Result:", {
//       //       success: !!sessionData,
//       //       error: sessionError,
//       //     });

//       //     break;
//       //   }
//       case "PAYMENT.CAPTURE.COMPLETED": {
//         const checkout = event.resource;

//         // Log the received custom_id
//         console.log("Webhook - Raw custom_id:", checkout.custom_id);

//         // Log the parsed values
//         const [sessionId, teacherId, studentId] = checkout.custom_id.split("|");
//         console.log("Webhook - Parsed IDs:", {
//           sessionId,
//           teacherId,
//           studentId,
//         });

//         // // Log the values being inserted
//         // console.log("Webhook - Payment Insert Data:", {
//         //   payment_intent_id: checkout.id,
//         //   amount: Number(checkout.amount.value),
//         //   session_id: sessionId,
//         //   teacher_id: teacherId,
//         //   student_id: studentId,
//         // });
//         // console.log("Webhook - Looking up session with ID:", sessionId);
//         // const { data: sessionD } = await supabase
//         //   .from("sessions")
//         //   .select("*")
//         //   .eq("id", sessionId)
//         //   .single();
//         // console.log("Webhook - Found session:", sessionD);
//         // // await supabase
//         // //   .from("sessions")
//         // //   .update({ status: "scheduled" })
//         // //   .eq("id", sessionD?.id);
//         // // console.log("Webhook - Updated session status to scheduled");

//         // Continue with payment insertion...
//         // const { data, error } = await supabase
//         //   .from("payments")
//         //   .insert({
//         //     payment_intent_id: checkout.id,
//         //     amount: Number(checkout.amount.value),
//         //     session_id: sessionId,
//         //     teacher_id: teacherId,
//         //     student_id: studentId,
//         //     status: "onhold",
//         //     payout_due_date: sessionD?.scheduledAt
//         //       ? new Date(sessionD.scheduledAt).getTime() +
//         //         7 * 24 * 60 * 60 * 1000
//         //       : new Date(Date.now() + 60 * 1000),
//         //     teacher_amount: Number(
//         //       checkout.seller_receivable_breakdown.net_amount.value,
//         //     ),
//         //   })
//         //   .select("*");
//         // console.log(data, error, "Payment Data");
//         break;
//       }

//       case "PAYMENT.CAPTURE.DENIED":
//       case "PAYMENT.CAPTURE.DECLINED": {
//         console.log("Payment Failed Event:", {
//           orderId: event.resource.supplementary_data?.related_ids?.order_id,
//           reason: event.resource.status_details,
//         });
//         /*
//         await supabase
//           .from("payments")
//           .update({
//             status: "failed",
//             payment_details: event.resource,
//           })
//           .eq("order_id", orderId);
//         */
//         break;
//       }

//       case "PAYMENT.CAPTURE.REFUNDED": {
//         console.log("Payment Refunded Event:", {
//           orderId: event.resource.supplementary_data?.related_ids?.order_id,
//           refundId: event.resource.id,
//           amount: event.resource.amount,
//         });
//         /*
//         await supabase
//           .from("payments")
//           .update({
//             status: "refunded",
//             payment_details: event.resource,
//           })
//           .eq("order_id", orderId);
//         */
//         break;
//       }
//     }

//     return res.status(200).json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return res.status(500).json({ error: "Webhook handler failed" });
//   }
// }
