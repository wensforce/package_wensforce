// app/api/cashfree/create-order/route.js
import { NextResponse } from 'next/server';

const CF_BASE_URL =
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customerName, customerPhone, planId } = body;

    // Server-side validation
    if (!customerName || !customerPhone || !amount || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const orderId = `WENS_${planId.toUpperCase()}_${Date.now()}`;

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
        order_currency: 'INR',
        customer_details: {
          customer_id: `WENS_${planId}_${customerPhone}`,
          customer_name: customerName,
          customer_phone: customerPhone,
        },
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