import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }: { request: Request }) {
  const { sessionId, amountSats } = await request.json();
  if (!sessionId || typeof sessionId !== 'string') {
    return json({ error: 'sessionId required' }, { status: 400 });
  }
  if (!amountSats || !Number.isInteger(amountSats) || amountSats < 1) {
    return json({ error: 'amountSats must be a positive integer' }, { status: 400 });
  }

  if (env.MEMBERSHIPS_DISABLED === 'true' || env.MEMBERSHIPS_DISABLED === '1') {
    return json({ error: 'Memberships temporarily disabled' }, { status: 503 });
  }

  if (!env.BTCPAY_URL || !env.BTCPAY_STORE_ID || !env.BTCPAY_API_KEY) {
    return json({ error: 'BTCPay not configured on this server' }, { status: 501 });
  }

  const strip = (s: string) => s.trim().replace(/^["']|["']$/g, '');
  const btcUrl = strip(env.BTCPAY_URL).replace(/\/+$/, '');
  const storeId = strip(env.BTCPAY_STORE_ID);
  const url = `${btcUrl}/api/v1/stores/${storeId}/lightning/BTC/invoices`;

  const msatAmount = (amountSats * 1000).toString();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${strip(env.BTCPAY_API_KEY)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: msatAmount,
      description: 'multiplayer.yoga membership',
      expiry: 3600,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return json({ error: `BTCPay error: ${res.status}`, detail: text }, { status: 502 });
  }

  const invoice = await res.json();

  return json({
    invoiceId: invoice.id,
    BOLT11: invoice.BOLT11 ?? invoice.paymentRequest ?? null,
    expiresAt: invoice.expiresAt,
  });
}
