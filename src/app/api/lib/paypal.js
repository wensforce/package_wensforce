export async function getPayPalToken() {
  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",  // use api-m.paypal.com for live
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );
  const data = await res.json();
  return data.access_token;
}