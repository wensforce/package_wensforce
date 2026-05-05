// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { orderId } = await req.json();
  const token = await getPayPalToken(); // reuse from above

  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (data.status === "COMPLETED") {
    // ✅ Update your DB: mark booking as confirmed
  }

  return NextResponse.json(data);
}