// app/api/paypal/capture-order/route.js
import { NextResponse } from "next/server";
import { getPayPalToken } from "../../lib/paypal";
import { sendWhatsAppTemplate, assignCustomerTags } from "../../lib/whatsapp";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const token = await getPayPalToken();

    const response = await fetch(
      process.env.PAYPAL_ENV === "production"
        ? `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`
        : `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal capture error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to capture payment" },
        { status: 400 },
      );
    }

    // Extract customer info from custom_id
    let customerName = "Customer";
    let customerPhone = null;
    let planId = null;

    try {
      if (data.purchase_units?.[0]?.custom_id) {
        const customData = JSON.parse(data.purchase_units[0].custom_id);
        customerName = customData.customerName || "Customer";
        customerPhone = customData.customerPhone;
        planId = customData.planId;
      }
    } catch (e) {
      console.error("Failed to parse custom_id:", e);
    }

    const isCompleted = data.status === "COMPLETED";
    const amount = data.purchase_units?.[0]?.amount?.value || "N/A";

    // Send WhatsApp notifications based on payment status
    if (customerPhone) {
      if (isCompleted) {
        // Send success template
        await sendWhatsAppTemplate({
          to: customerPhone,
          templateName: "payment_confirmation",
          templateParams: [customerName, orderId, amount],
        });

        // Assign success custom fields
        // await assignCustomerTags({
        //   phone: customerPhone,
        //   customFields: [
        //     { name: 'lead_status', value: 'paid' },
        //     { name: 'payment_method', value: 'paypal' },
        //     { name: 'order_id', value: orderId },
        //     { name: 'plan', value: planId },
        //   ],
        // });
      } else {
        // Send failure template
        await sendWhatsAppTemplate({
          to: customerPhone,
          templateName: "payment_failed",
          templateParams: [customerName, orderId, data.status || "FAILED"],
        });

        // Assign failure custom fields
        // await assignCustomerTags({
        //   phone: customerPhone,
        //   customFields: [
        //     { name: 'lead_status', value: 'payment_failed' },
        //     { name: 'payment_method', value: 'paypal' },
        //     { name: 'order_id', value: orderId },
        //     { name: 'plan', value: planId },
        //   ],
        // });
      }
    }

    return NextResponse.json({ paid: isCompleted, status: data.status, data });
  } catch (err) {
    console.error("PayPal capture-order error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
