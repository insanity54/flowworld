import { heartbeat } from '$lib/server/realtime';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  if (body?.id) heartbeat(body.id);
  return json({ ok: true });
}
