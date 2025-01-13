import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { WelcomeEmail } from "@/components/EmailTemplates/Welcome";
import { MessageNotification } from "@/components/EmailTemplates/MessageNotification";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { id, message } = req.body;

      const supabase = createClient(req, res);

      const { data, error } = await supabase.auth.getUser();

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data?.user?.id as string)
        .single();

      const { data: teacherData, error: teacherError } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      await resend.emails.send({
        from: "admin@torah-net.com",
        to: teacherData?.email as string,
        subject: `New Message from ${userData?.name}`,
        react: MessageNotification({
          message: message,
          senderName: userData?.name,
          username: teacherData?.name,
        }),
      });
      res.status(200).json({ message: "Email sent" });
    } catch (error: any) {
      console.log(error, "Error");
      res.status(400).json({ error: error.message });
    }
  }
}
