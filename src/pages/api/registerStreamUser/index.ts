import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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

    const client = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!
    );

    const token = client.createToken(userData?.id as string);

    res.status(200).json({ token });
  }
}
