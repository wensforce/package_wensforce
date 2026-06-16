// app/api/cashfree/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  sendWhatsAppTemplate,
  sendWhatsAppTemplateToBroadcast,
} from "../../lib/whatsapp";
import { sendCapiEvent } from "@/app/lib/metaCapi";
import { generateEventId } from "@/app/lib/metaPixel";

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
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/webhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": process.env.BACKEND_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        cashfreeId: event.data?.order?.order_id,
        orderStatus: event.data?.payment?.payment_status,
        orderAmount: event.data?.payment?.payment_amount,
      }),
    },
  );
  
  const resData = await res.json();
  if (resData.data?.count === 0) {
    return NextResponse.json({ message: "Already processed" }, { status: 200 });
  }

  // Send WhatsApp notifications based on payment status
  if (event.data?.customer_details?.customer_phone) {
    const phone = event.data?.customer_details?.customer_phone;
    const customerName =
      event.data?.customer_details?.customer_name || "Customer";
    const plan = event.data?.order?.order_tags?.plan_id || "Membership";

    const isPaid = event.data?.payment?.payment_status === "SUCCESS";
    const orderId = event.data?.order?.order_id;
    const reason = event.data?.payment?.payment_status === "USER_DROPPED" ? "User Dropped" : event.data?.error_details?.error_description || "N/A";

    if (isPaid) {
      // Fire Meta CAPI Purchase event
      try {
        const nameParts = (customerName || "").trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        await sendCapiEvent({
          eventName: 'Purchase',
          eventId: generateEventId('Purchase'),
          userData: {
            phone: phone,
            ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined,
            userAgent: req.headers.get('user-agent') || undefined,
            fn: firstName,
            ln: lastName,
            em: event.data?.customer_details?.customer_email || null,
          },
          customData: {
            value: event.data?.payment?.payment_amount,
            currency: event.data?.order?.order_currency || 'INR',
            orderId,
            contentName: plan,
          },
          eventSourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/${event.data?.order?.order_tags?.plan_id || ''}`,
        });
      } catch (err) {
        console.error('CAPI Purchase webhook error:', err);
      }

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
        sendWhatsAppTemplateToBroadcast(
          "abandoned cart",
          "abandoned_cart_payment_success",
          [orderId, customerName, plan, new Date().toISOString()],
          phone
        ),
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
        sendWhatsAppTemplateToBroadcast(
          "abandoned cart",
          "abandoned_cart_payment_failed",
          [customerName, plan, new Date().toISOString(), reason],
          phone
        ),
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
