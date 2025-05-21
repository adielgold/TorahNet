import { createClient } from "@supabase/supabase-js"; // NOT @supabase/ssr

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  // Verify the token and get user data
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Fetch the user's role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.query.userId as string;

  try {
    // Prevent admin from deleting themselves
    if (user.id === userId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Delete related records first (due to foreign key constraints)
    await Promise.all([
      supabase.from("payment_details").delete().eq("id", userId),
      supabase.from("payments").delete().eq("teacher_id", userId),
      supabase.from("payments").delete().eq("student_id", userId),
      supabase.from("reviews").delete().eq("teacher_id", userId),
      supabase.from("reviews").delete().eq("student_id", userId),
      supabase.from("sessions").delete().eq("teacher_id", userId),
      supabase.from("sessions").delete().eq("student_id", userId),
      supabase.from("withdrawals").delete().eq("teacher_id", userId),
    ]);

    // Finally delete the user
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}
