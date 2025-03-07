import { NextApiRequest, NextApiResponse } from "next";
import createClient from "@/utils/supabase/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabase = createClient(req, res);

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Step 1: Get session data with teacher details
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select(
        `*,
         teacher:teacher_id(
          *,
          payment_details(*)
         )
        `,
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error("Error fetching session data:", sessionError);
      return res.status(404).json({ error: "Session not found" });
    }

    console.log("Session data retrieved:", {
      id: sessionData.id,
      status: sessionData.status,
      teacherHourlyRate: sessionData?.teacher?.payment_details?.hourly_rate,
    });

    const { data, error } = await supabase.auth.getUser();
    console.log("Create Order - User Data:", {
      userId: data?.user?.id,
      error,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Step 2: Update session status to scheduled
    const { data: updatedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "scheduled",
      })
      .eq("id", sessionData.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating session status:", updateError);
      return res.status(500).json({ error: "Failed to update session status" });
    }

    console.log("Session status updated:", {
      id: updatedSession.id,
      status: updatedSession.status,
    });

    // Step 3: Create a mock payment record
    const mockPaymentId = `MOCK_PAYMENT_${Date.now()}`;
    const hourlyRate = sessionData?.teacher?.payment_details?.hourly_rate || 20; // Default to 20 if not available

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        payment_intent_id: mockPaymentId,
        amount: hourlyRate * 0.5, // Half hour rate as the amount
        session_id: sessionId,
        teacher_id: sessionData.teacher_id,
        student_id: data.user.id,
        status: "onhold",
        payout_due_date: new Date(
          new Date(sessionData.scheduledAt).getTime() + 7 * 24 * 60 * 60 * 1000, // 7 days after scheduled time
        ),
        teacher_amount: hourlyRate,
      })
      .select();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      return res.status(500).json({ error: "Failed to create payment record" });
    }

    console.log("Payment record created:", {
      id: paymentData[0].id,
      paymentIntentId: paymentData[0].payment_intent_id,
      status: paymentData[0].status,
    });

    // Return success response with created data
    return res.status(200).json({
      success: true,
      message: "Mock payment processed successfully",
      data: {
        session: updatedSession,
        payment: paymentData[0],
      },
    });
  } catch (error) {
    console.error("Mock payment update error:", error);
    return res.status(500).json({
      error: "Something went wrong",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
