import { j as json } from './index-lhTMmBNn.js';
import { b as private_env } from './shared-server-cF6ckHns.js';

async function POST({ request }) {
  const { sessionId, amountSats } = await request.json();
  if (!sessionId || typeof sessionId !== "string") {
    return json({ error: "sessionId required" }, { status: 400 });
  }
  if (!amountSats || !Number.isInteger(amountSats) || amountSats < 1) {
    return json({ error: "amountSats must be a positive integer" }, { status: 400 });
  }
  if (!private_env.BTCPAY_URL || !private_env.BTCPAY_STORE_ID || !private_env.BTCPAY_API_KEY) {
    return json({ error: "BTCPay not configured on this server" }, { status: 501 });
  }
  const strip = (s) => s.trim().replace(/^["']|["']$/g, "");
  const btcUrl = strip(private_env.BTCPAY_URL).replace(/\/+$/, "");
  const storeId = strip(private_env.BTCPAY_STORE_ID);
  const url = `${btcUrl}/api/v1/stores/${storeId}/lightning/BTC/invoices`;
  const msatAmount = (amountSats * 1e3).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `token ${strip(private_env.BTCPAY_API_KEY)}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: msatAmount,
      description: "multiplayer.yoga membership",
      expiry: 3600
    })
  });
  if (!res.ok) {
    const text = await res.text();
    return json({ error: `BTCPay error: ${res.status}`, detail: text }, { status: 502 });
  }
  const invoice = await res.json();
  return json({
    invoiceId: invoice.id,
    BOLT11: invoice.BOLT11 ?? invoice.paymentRequest ?? null,
    expiresAt: invoice.expiresAt
  });
}

export { POST };
//# sourceMappingURL=_server.ts-CMV9j6Ta.js.map
