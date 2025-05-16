export async function getPayPalAccessToken(merchantId?: string) {
  const BASE_URL = process.env.PAYPAL_BASE_URL;
  const query = merchantId ? `?target_subject=${merchantId}` : "";
  const authString = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`,
  ).toString("base64");

  // Define scope if merchantId is provided
  const scope = merchantId
    ? "&scope=https://uri.paypal.com/services/payments/refund https://uri.paypal.com/services/payments/payouts"
    : "";

  const tokenResponse = await fetch(`${BASE_URL}/v1/oauth2/token${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authString}`,
      // "PayPal-Partner-Attribution-Id": `${process.env.PAYPAL_BN}`,
    },
    body: `grant_type=client_credentials${scope}`,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(`PayPal Token Error: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}
