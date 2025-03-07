import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
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

    const account = await stripe.accounts.create({
      type: "express",
      country: "LT",
      email: userData?.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/profile/settings`,
      return_url: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/profile/settings`,
      type: "account_onboarding",
    });

    await supabase
      .from("payment_details")
      .update({
        stripe_account_id: account.id,
      })
      .eq("id", userData?.id);

    console.log(accountLink, "Account Link");

    res.status(200).json({ url: accountLink?.url });
  } catch (error: any) {
    console.log(error, "Error");
    res.status(400).json({ error: error?.message });
  }
}
