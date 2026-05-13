import { u as updateColor } from './realtime-D5HdVqZU.js';
import { j as json } from './index-lhTMmBNn.js';

async function POST({ request }) {
  const body = await request.json();
  if (body?.id && body?.color) updateColor(body.id, body.color);
  return json({ ok: true });
}

export { POST };
//# sourceMappingURL=_server.ts-MzIfIVQ-.js.map
