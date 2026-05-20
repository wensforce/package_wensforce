// app/api/cashfree/create-order/route.js
import { NextResponse } from 'next/server';

const CF_BASE_URL =
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

// Currencies supported for international payments via Cashfree
const SUPPORTED_CURRENCIES = new Set([
  'INR',
  'USD','GBP','THB','AED','EUR','AUD','CNY','LKR','MYR','VND',
  'SGD','SAR','ZAR','CHF','CAD','NPR','OMR','HKD','BDT','JPY',
  'SEK','QAR','NZD','ILS','KWD','BHD','DKK','KES','MUR','NOK',
  'PHP','RUB','AFN','ALL','DZD','AOA','XCD','ARS','AMD','AWG',
  'AZN','BSD','BBD','BZD','XOF','BMD','BTN','BOB','BWP','BAM',
  'BRL','BND','BGN','BIF','KHR','XAF','CVE','KYD','CLP','COP',
  'KMF','CRC','CZK','DJF','EGP','ERN','ETB','FJD','GMD','GEL',
  'GHS','GIP','GTQ','GNF','GYD','HTG','HNL','HUF','ISK','IDR',
  'IQD','JMD','JOD','KZT','KGS','LAK','LBP','LRD','LYD','MAD',
  'MZN','NAD','NGN','PGK','PYG','PEN','PLN','TRY','UAH','UYU',
  'UZS','VUV','YER','ZMW','CDF','DOP','FKP','KRW','MDL','MGA',
  'MKD','MNT','MOP','MRU','MVR','MWK','MXN','NIO','RON','RSD',
  'RWF','SBD','SCR','SHP','SLL','SOS','SRD','SZL','TJS','TMT',
  'TND','TOP','TTD','TWD','TZS','UGX','WST','XPF',
]);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customerName, customerPhone, customerEmail, planId, currency = 'INR' } = body;

    // Server-side validation
    if (!customerName || !customerPhone || !amount || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!SUPPORTED_CURRENCIES.has(currency)) {
      return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
    }
    if (currency === 'INR' && !/^\d{10}$/.test(customerPhone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Sanitise email if provided
    const safeEmail = typeof customerEmail === 'string'
      ? customerEmail.trim().slice(0, 254)
      : undefined;
    if (safeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const orderId = `WENS_${planId.toUpperCase()}_${Date.now()}`;

    const customerDetails = {
      customer_id: `WENS_${planId}_${customerPhone.replace(/\D/g, '').slice(-10)}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      ...(safeEmail && { customer_email: safeEmail }),
    };

    const response = await fetch(CF_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
         order_currency: currency,
        customer_details: customerDetails,
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/booking/confirmation?order_id={order_id}&plan=${planId}`,
          notify_url: `${process.env.NEXT_PUBLIC_URL}/api/cashfree/webhook`,
        },
        order_note: `WENS Force ${planId} Membership`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree order creation failed:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create payment order' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
    });
  } catch (err) {
    console.error('create-order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}