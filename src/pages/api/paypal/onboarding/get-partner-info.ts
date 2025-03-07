import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { referralToken } = req.query;

  if (!referralToken) {
    return res.status(400).json({ error: "Missing referral token" });
  }

  const BASE_URL = process.env.PAYPAL_BASE_URL;

  try {
    const accessToken = await getPayPalAccessToken();

    // Get partner information
    const partnerResponse = await fetch(
      `${BASE_URL}/v2/customer/partner-referrals/${referralToken}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const partnerData = await partnerResponse.json();

    if (!partnerResponse.ok) {
      console.error("PayPal Partner Info Error:", partnerData);
      return res.status(partnerResponse.status).json({ error: partnerData });
    }

    return res.status(200).json(partnerData);
  } catch (error) {
    console.error("Error getting partner info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
