import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const supabase = createClient(req, res);

    const { error } = await supabase.auth.getUser();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const { sessionId, startsAt, scheduledAt } = req.body;

      const { error } = await supabase
        .from("sessions")
        .update({
          startsAt: startsAt,
          scheduledAt: scheduledAt,
        })
        .eq("id", sessionId);

      const { error: payment_error } = await supabase
        .from("payments")
        .update({
          payout_due_date: new Date(
            new Date(scheduledAt).getTime() + 7 * 24 * 60 * 60 * 1000
          ),
        })
        .eq("session_id", sessionId);

      if (error || payment_error) {
        throw new Error(error?.message || payment_error?.message);
      }

      res.status(200).json({ message: "Session rescheduled successfully" });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
}
