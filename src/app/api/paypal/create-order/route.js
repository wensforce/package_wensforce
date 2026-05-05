// app/api/paypal/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayPalToken } from "../../lib/paypal"; // helper to get access token

export async function POST(req) {
  const { amount, bookingId } = await req.json();
  const token = await getPayPalToken();

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
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
            amount: { currency_code: "USD", value: amount },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/booking/confirmation`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/booking`,
        },
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}