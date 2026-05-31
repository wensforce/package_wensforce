// app/api/cashfree/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendWhatsAppTemplate } from "../../lib/whatsapp";

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

  console.log("Received Cashfree webhook:", event.data);

  // Send WhatsApp notifications based on payment status
  if (event.data?.customer_details?.customer_phone) {
    const phone = event.data?.customer_details?.customer_phone;
    const customerName =
      event.data?.customer_details?.customer_name || "Customer";
    const plan = event.data?.order?.order_note || "Membership";

    const isPaid = event.data?.payment?.payment_status === "SUCCESS";
    const orderId = event.data?.order?.order_id;

    if (isPaid) {
      // Send success template
      await Promise.all([
        sendWhatsAppTemplate({
          to: phone,
          templateName: "membership_payment_successful",
          templateParams: [
            customerName,
            plan,
            orderId,
            new Date().toISOString(),
          ],
        }),
        sendWhatsAppTemplate({
          to: 7217210054,
          templateName: "membership_payment_successful",
          templateParams: [
            customerName,
            plan,
            orderId,
            new Date().toISOString(),
          ],
        }),
      ]);
      // Assign success custom fields
      // await assignCustomerTags({
      //   phone,
      //   customFields: [
      //     { name: 'lead_status', value: 'paid' },
      //     { name: 'payment_method', value: 'cashfree' },
      //     { name: 'order_id', value: orderId },
      //   ],
      // });
    } else {
      // Send failure template

      await Promise.all([
        sendWhatsAppTemplate({
          to: phone,
          templateName: "membership_payment_failed",
          templateParams: [
            customerName,
            plan,
            orderId,
            new Date().toISOString(),
            7304607954,
          ],
        }),
        sendWhatsAppTemplate({
          to: 7217210054,
          templateName: "membership_payment_failed",
          templateParams: [
            customerName,
            plan,
            orderId,
            new Date().toISOString(),
            7304607954,
          ],
        }),
      ]);

      // Assign failure custom fields
      // await assignCustomerTags({
      //   phone,
      //   customFields: [
      //     { name: 'lead_status', value: 'payment_failed' },
      //     { name: 'payment_method', value: 'cashfree' },
      //     { name: 'order_id', value: orderId },
      //   ],
      // });
    }
  }

  return NextResponse.json({ received: true });
}
