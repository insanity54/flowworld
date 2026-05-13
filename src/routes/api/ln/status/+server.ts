import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }: { request: Request }) {
  const { invoiceId } = await request.json();
  if (!invoiceId || typeof invoiceId !== 'string') {
    return json({ error: 'invoiceId required' }, { status: 400 });
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
  const url = `${btcUrl}/api/v1/stores/${storeId}/lightning/BTC/invoices/${invoiceId}`;

  const res = await fetch(url, {
    headers: { Authorization: `token ${strip(env.BTCPAY_API_KEY)}` },
  });

  if (!res.ok) {
    const text = await res.text();
    return json({ error: `BTCPay error: ${res.status}`, detail: text }, { status: 502 });
  }

  const data = await res.json();
  return json({ status: data.status });
}
