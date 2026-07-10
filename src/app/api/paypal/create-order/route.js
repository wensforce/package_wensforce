// app/api/paypal/create-order/route.js
import { NextResponse } from "next/server";
import { getPayPalToken } from "../../lib/paypal";

export async function POST(req) {
  try {
    const { amount, bookingId, customerName, customerPhone, planId } =
      await req.json();

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: { message: "Missing amount or bookingId" } },
        { status: 400 },
      );
    }

    const token = await getPayPalToken();

    const response = await fetch(
      process.env.PAYPAL_ENV === "production"
        ? "https://api-m.paypal.com/v2/checkout/orders"
        : "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: bookingId,
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
              description: `WENS Force ${planId} Membership`,
              custom_id: JSON.stringify({
                customerName,
                customerPhone,
                planId,
                bookingId,
              }),
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_URL}/booking/confirmation?payment_method=paypal&plan=${planId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/booking/${planId}`,
            brand_name: "WENS Force",
            locale: "en-US",
            landing_page: "BILLING",
            user_action: "PAY_NOW",
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal API error:", data);
      return NextResponse.json(
        { error: { message: data.message || "Failed to create PayPal order" } },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PayPal create-order error:", err);
    return NextResponse.json(
      { error: { message: err.message || "Internal server error" } },
      { status: 500 },
    );
  }
}
