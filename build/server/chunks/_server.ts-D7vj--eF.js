import { b as broadcast } from './realtime-D5HdVqZU.js';
import { j as json } from './index-lhTMmBNn.js';

async function POST({ request }) {
  const body = await request.json();
  if (body?.pose && body?.id) {
    broadcast("pose", { id: body.id, ...body.pose });
    return json({ ok: true });
  }
  return json({ ok: false, error: "missing id or pose data" }, { status: 400 });
}

export { POST };
//# sourceMappingURL=_server.ts-D7vj--eF.js.map
