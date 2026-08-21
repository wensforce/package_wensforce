// Proxies exchange rates from backend (ExchangeRate-API → Redis cache)
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const currency = (searchParams.get("currency") || "USD").toUpperCase();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "API base URL not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${baseUrl}/payment/exchange-rate?currency=${currency}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } },
    );

    const body = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: body.message || "Failed to fetch exchange rate" },
        { status: response.status },
      );
    }

    const data = body.data ?? body;
    return NextResponse.json({
      rate: data.rate,
      currency: data.currency ?? currency,
      source: data.source ?? "exchangerate-api",
    });
  } catch (error) {
    console.error("Exchange rate proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 502 },
    );
  }
}
