import { getPayPalAccessToken } from "@/lib/paypalAccessToken";
import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
interface PayPalLink {
  rel: string;
  href: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient(req, res);

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data?.user?.id as string)
    .single();

  console.log(userData, "User Data");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;
  const BASE_URL = process.env.PAYPAL_BASE_URL;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    return res.status(500).json({ error: "PayPal credentials are missing" });
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const trackingId = uuidv4();
    // 🔹 Call PayPal Partner Referrals API
    const response = await fetch(`${BASE_URL}/v2/customer/partner-referrals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: userData?.email,
        tracking_id: trackingId,
        partner_config_override: {
          return_url: `${process.env.DEV_REDIRECT_URL}/profile/settings`,
          return_url_description: "Redirect after onboarding",
          show_add_credit_card: true,
        },
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
                third_party_details: {
                  features: ["PAYMENT", "REFUND", "PARTNER_FEE"],
                },
              },
            },
          },
        ],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      console.error("PayPal API Error:", data); // 🔥 Log the full PayPal error response
      return res.status(response.status).json({ error: data });
    }

    const connectUrl =
      data?.links?.find((link: PayPalLink) => link.rel === "action_url")
        ?.href || null;
    const referralToken =
      connectUrl?.split("referralToken=")[1]?.replace(/=*$/, "") || null;

    console.log("Connect URL:", connectUrl);

    res.status(200).json({ url: connectUrl, referralToken });

    return res.status(400).json({ error: "Failed to generate PayPal URL" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
