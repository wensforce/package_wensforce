// app/api/cashfree/verify-order/route.js
import { NextResponse } from 'next/server';
import { sendWhatsAppTemplate, assignCustomerTags } from '../../lib/whatsapp';

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
    const response = await fetch(`${CF_BASE_URL}/${encodeURIComponent(orderId)}`, {
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
    
    const isPaid = data.order_status === 'PAID';
    
    // Send WhatsApp notifications based on payment status
    if (data.customer_details?.customer_phone) {
      const phone = data.customer_details.customer_phone;
      const customerName = data.customer_details?.customer_name || 'Customer';
      const plan = data.order_note || 'Membership';

      
      if (isPaid) {
        // Send success template
        await sendWhatsAppTemplate({
          to: phone,
          templateName: 'membership_payment_successful',
          templateParams: [customerName, plan, orderId, new Date().toISOString()],
        });
        
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
        await sendWhatsAppTemplate({
          to: phone,
          templateName: 'payment_failed',
          templateParams: [customerName, orderId, data.order_status || 'FAILED'],
        });
        
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
    
    return NextResponse.json({
      paid: isPaid,
      status: data.order_status,
    });
  } catch (err) {
    return NextResponse.json({ paid: false, status: 'error' }, { status: 200 });
  }
}
