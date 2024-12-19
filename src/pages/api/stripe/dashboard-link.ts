// pages/api/stripe/dashboard-link.js
import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { stripeAccountId } = req.body;

    try {
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      res.status(200).json({ url: loginLink.url });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
