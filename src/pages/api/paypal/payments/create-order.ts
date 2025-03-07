import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

interface PayPalLink {
  rel: string;
  href: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabase = createClient(req, res);
  const BASE_URL = process.env.PAYPAL_BASE_URL;

  const { data, error } = await supabase.auth.getUser();
  console.log("Create Order - User Data:", {
    userId: data?.user?.id,
    error,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

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

  console.log("Create Order - Session Check:", {
    sessionData,
    sessionError,
    sessionId,
  });

  const { data: verifySession } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId);

  console.log("Session Verification:", {
    exists: verifySession && verifySession.length > 0,
    sessionId,
    data: verifySession,
  });

  if (!sessionData || sessionError) {
    res.status(404).json({ error: "Session not found" });
  }

  try {
    // saved for production
    // Calculate fees based on teacher's hourly rate
    // const hourly_rate = sessionData?.teacher?.payment_details?.hourly_rate || 0;
    // const productPrice = hourly_rate;
    // const buyerFee = productPrice * 0.04 + 0.49; // 5% buyer fee
    // const totalAmount = productPrice + buyerFee;
    // const platformFee = productPrice * 0.04 + 0.49; // 5% platform fee

    const accessToken = await getPayPalAccessToken();
    //for dev
    const hourly_rate = 20;
    const productPrice = hourly_rate * 3;
    const buyerFee = productPrice * 0.05;
    const totalAmount = productPrice + buyerFee;
    const platformFee = productPrice * 0.05;

    const customData = `${sessionId}|${sessionData.teacher_id}|${data.user.id}`;
    console.log("Create Order - Custom Data:", {
      sessionId,
      teacherId: sessionData.teacher_id,
      studentId: data.user.id,
      combinedString: customData,
    });

    const orderResponse = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Partner-Attribution-Id": `${process.env.PAYPAL_BN}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: productPrice.toFixed(2),
                },
                tax_total: {
                  currency_code: "USD",
                  value: buyerFee.toFixed(2),
                },
              },
            },
            payee: {
              merchant_id:
                sessionData?.teacher?.payment_details?.stripe_account_id,
            },
            payment_instruction: {
              disbursement_mode: "DELAYED",
              platform_fees: [
                {
                  amount: {
                    currency_code: "USD",
                    value: platformFee.toFixed(2),
                  },
                  payee: {
                    merchant_id: process.env.PAYPAL_ID,
                  },
                },
              ],
            },
            custom_id: customData,
            description: "Video call with ${sessionData.teacher.name}",
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              shipping_preference: "NO_SHIPPING",
              return_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/chat?payment=true&sessionId=${sessionId}&teacherId=${sessionData.teacher_id}&studentId=${data.user.id}`,
              cancel_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/chat?payment=false&sessionId=${sessionId}`,
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              user_action: "PAY_NOW",
            },
          },
        },
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderData.id) {
      return res.status(500).json({
        error: "Failed to create order",
        details: orderData,
      });
    }

    // const approveUrl = orderData.links.find(
    //   (link) => link.rel === "approve",
    // )?.href;

    // if (!approveUrl) {
    //   return res.status(500).json({ error: "Failed to generate approval URL" });
    // }

    const payerActionUrl = orderData.links.find(
      (link: PayPalLink) => link.rel === "payer-action",
    )?.href;

    if (!payerActionUrl) {
      return res.status(500).json({ error: "Failed to generate approval URL" });
    }

    return res.status(200).json({ payerActionUrl });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
      details: error,
    });
  }
}
