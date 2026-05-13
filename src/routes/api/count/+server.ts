import { json } from '@sveltejs/kit';

let count = 0;

export function GET() {
  count += 1;
  return json({ count });
}
