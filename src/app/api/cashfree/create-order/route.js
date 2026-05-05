// app/api/cashfree/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { amount, customerName, customerEmail, customerPhone, bookingId } =
    await req.json();

  const response = await fetch(
    "https://sandbox.cashfree.com/pg/orders",  // change to api.cashfree.com for PROD
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: `ORDER_${bookingId}_${Date.now()}`,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: customerEmail,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/booking/confirmation?order_id={order_id}`,
          notify_url: `${process.env.NEXT_PUBLIC_URL}/api/cashfree/webhook`,
        },
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}