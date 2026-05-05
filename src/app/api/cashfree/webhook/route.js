// app/api/cashfree/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");

  // Verify signature
  const expectedSig = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
    .update(timestamp + body)
    .digest("base64");

  if (signature !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.data?.order?.order_status === "PAID") {
    const orderId = event.data.order.order_id;
    // ✅ Update your DB: mark booking as confirmed
    // await db.booking.update({ where: { orderId }, data: { status: "confirmed" } })
    console.log("Booking confirmed:", orderId);
  }

  return NextResponse.json({ received: true });
}