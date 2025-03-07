export async function capturePaypalPayment(
  token: string,
  sessionId: string,
  teacherId: string,
  studentId: string,
) {
  try {
    const response = await fetch("/api/paypal/payments/capture-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, sessionId, teacherId, studentId }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error };
  }
}
