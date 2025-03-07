import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";
import { getPayPalAccessToken } from "@/lib/paypalAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { merchantId } = req.query; // Get merchantId from query
    return handleSellerStatus(req, res, merchantId as string);
  } else if (req.method === "POST") {
    const { merchantId } = req.body; // Get merchantId from body
    return handleSellerStatus(req, res, merchantId);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleSellerStatus(
  req: NextApiRequest,
  res: NextApiResponse,
  merchantId?: string,
) {
  if (!merchantId) {
    return res.status(400).json({ error: "Merchant ID is required" });
  }

  const supabase = createClient(req, res);
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const BASE_URL = process.env.PAYPAL_BASE_URL;

    const accessToken = await getPayPalAccessToken();

    const PaypalId = process.env.PAYPAL_ID;
    // Get seller/merchant status
    const statusResponse = await fetch(
      `${BASE_URL}/v1/customer/partners/${PaypalId}/merchant-integrations?tracking_id=${merchantId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const statusData = await statusResponse.json();
    console.log("Seller Status:", statusData);

    if (!statusResponse.ok) {
      return res.status(statusResponse.status).json({
        error: "Failed to get seller status",
        details: statusData,
      });
    }

    if (statusData.merchant_id) {
      await supabase
        .from("payment_details")
        .update({
          stripe_account_id: statusData.merchant_id,
          onboarding_completed: true,
        })
        .eq("id", user.user.id);
      console.log("Seller Status:", statusData.merchant_id);

      return res.status(200).json({
        status: "ACTIVE",
        merchantId: statusData.merchant_id,
        details: statusData,
      });
    }

    // If no merchant_id, check if there's a pending status
    if (statusData.length > 0) {
      const merchantStatus = statusData[0].merchant_status;
      return res.status(200).json({
        status: merchantStatus || "PENDING",
        details: statusData,
      });
    }

    // No integration found
    return res.status(200).json({
      status: "NOT_ONBOARDED",
      details: statusData,
    });
  } catch (error) {
    console.error("Error checking seller status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
