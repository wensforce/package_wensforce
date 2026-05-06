// app/api/exchange-rate/route.js
import { NextResponse } from "next/server";

const EXCHANGE_RATE_CACHE = {
  rate: null,
  timestamp: null,
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
};

export async function GET(req) {
  try {
    const now = Date.now();

    // Return cached rate if still valid
    if (
      EXCHANGE_RATE_CACHE.rate &&
      EXCHANGE_RATE_CACHE.timestamp &&
      now - EXCHANGE_RATE_CACHE.timestamp < EXCHANGE_RATE_CACHE.CACHE_DURATION
    ) {
      return NextResponse.json({
        rate: EXCHANGE_RATE_CACHE.rate,
        source: "cache",
      });
    }

    // Fetch fresh rate from external API
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const inrRate = data.rates.INR;

    // Cache the rate
    EXCHANGE_RATE_CACHE.rate = inrRate;
    EXCHANGE_RATE_CACHE.timestamp = now;

    return NextResponse.json({
      rate: inrRate,
      source: "live",
      timestamp: new Date(now).toISOString(),
    });
  } catch (error) {
    console.error("Exchange rate API error:", error);

    // Fallback to default rate if API fails
    return NextResponse.json(
      {
        rate: 95,
        source: "fallback",
        error: "Using default rate",
      },
      { status: 200 },
    );
  }
}
