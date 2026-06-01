// app/api/cashfree/verify-order/route.js
import { NextResponse } from 'next/server';

const CF_BASE_URL =
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }

  try {
    const response = await fetch(`${CF_BASE_URL}/${encodeURIComponent(orderId)}/payments`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ paid: false, status: 'error' }, { status: 200 });
    }
    
    const isPaid = data[0]?.payment_status === 'SUCCESS';

    return NextResponse.json({
      paid: isPaid,
      status: data[0]?.order_status,
      amount: data[0]?.order_amount,
      currency: data[0]?.order_currency,
      customer_name: data[0]?.customer_details?.customer_name,
      customer_phone: data[0]?.customer_details?.customer_phone,
      service_city: data[0]?.order_note, // Assuming city is passed in order_note
    });
  } catch (err) {
    return NextResponse.json({ paid: false, status: 'error' }, { status: 200 });
  }
}
