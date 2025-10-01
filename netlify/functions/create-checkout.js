const Stripe = require('stripe');

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  try {
    const body = JSON.parse(event.body || '{}');
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' }),
      };
    }

    const stripe = Stripe(secret);

    let line_items = body.line_items;
    if (!Array.isArray(line_items) || line_items.length === 0) {
      const amount = body.amount_cents || 1000; // $10 default
      line_items = [{
        price_data: { currency: 'usd', product_data: { name: 'Munch Rush Service' }, unit_amount: amount },
        quantity: 1
      }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: body.mode || 'payment',
      line_items,
      success_url: body.success_url || 'https://www.munchrushva.com/thanks.html',
      cancel_url: body.cancel_url || 'https://www.munchrushva.com/',
      metadata: body.metadata || undefined,
      customer_email: body.customer_email || undefined,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
