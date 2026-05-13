import { broadcast } from '$lib/server/realtime';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
  const body = await request.json();

  if (body?.pose && body?.id) {
    broadcast('pose', { id: body.id, ...body.pose });
    return json({ ok: true });
  }

  return json({ ok: false, error: 'missing id or pose data' }, { status: 400 });
}
