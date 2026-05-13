import { updateColor } from '$lib/server/realtime';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  if (body?.id && body?.color) updateColor(body.id, body.color);
  return json({ ok: true });
}
