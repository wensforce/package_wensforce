import { sendCapiEvent } from "@/app/lib/metaCapi.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const userAgent = req.headers.get("user-agent") || "";

    await sendCapiEvent({
      eventName: body.eventName,
      eventId: body.eventId,
      userData: {
        phone: body.phone || null,
        ip,
        userAgent,
        fn: body.firstName || null,
        ln: body.lastName || null,
        em: body.email || null,
        fbc: body.fbc || null,
        fbp: body.fbp || null,
      },
      customData: {
        value: body.value || 0,
        currency: body.currency || "INR",
        contentName: body.contentName || null,
        contentId: body.contentId || null,
        orderId: body.orderId || null,
      },
      eventSourceUrl: body.url,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("CAPI Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
