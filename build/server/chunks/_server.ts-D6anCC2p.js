import { j as json } from './index-lhTMmBNn.js';
import { b as private_env } from './shared-server-cF6ckHns.js';

async function POST({ request }) {
  const { invoiceId } = await request.json();
  if (!invoiceId || typeof invoiceId !== "string") {
    return json({ error: "invoiceId required" }, { status: 400 });
  }
  if (!private_env.BTCPAY_URL || !private_env.BTCPAY_STORE_ID || !private_env.BTCPAY_API_KEY) {
    return json({ error: "BTCPay not configured on this server" }, { status: 501 });
  }
  const strip = (s) => s.trim().replace(/^["']|["']$/g, "");
  const btcUrl = strip(private_env.BTCPAY_URL).replace(/\/+$/, "");
  const storeId = strip(private_env.BTCPAY_STORE_ID);
  const url = `${btcUrl}/api/v1/stores/${storeId}/lightning/BTC/invoices/${invoiceId}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${strip(private_env.BTCPAY_API_KEY)}` }
  });
  if (!res.ok) {
    const text = await res.text();
    return json({ error: `BTCPay error: ${res.status}`, detail: text }, { status: 502 });
  }
  const data = await res.json();
  return json({ status: data.status });
}

export { POST };
//# sourceMappingURL=_server.ts-D6anCC2p.js.map
