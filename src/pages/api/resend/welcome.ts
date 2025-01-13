import createClient from "@/utils/supabase/api";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { WelcomeEmail } from "@/components/EmailTemplates/Welcome";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const supabase = createClient(req, res);

      const { data, error } = await supabase.auth.getUser();

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data?.user?.id as string)
        .single();

      await resend.emails.send({
        from: "admin@torah-net.com",
        to: data?.user?.email as string,
        subject: "Welcome to TorahNet",
        react: WelcomeEmail({ name: userData?.name as string,role:userData?.role }),
      });
      res.status(200).json({ message: "Email sent" });
    } catch (error: any) {
      console.log(error, "Error");
      res.status(400).json({ error: error.message });
    }
  }
}
