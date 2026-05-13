import { h as heartbeat } from './realtime-D5HdVqZU.js';
import { j as json } from './index-lhTMmBNn.js';

async function POST({ request }) {
  const body = await request.json();
  if (body?.id) heartbeat(body.id);
  return json({ ok: true });
}

export { POST };
//# sourceMappingURL=_server.ts-DZihRrDV.js.map
