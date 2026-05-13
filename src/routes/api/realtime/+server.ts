import { addClient, registerSession } from '$lib/server/realtime';

export function GET() {
  const sessionId = crypto.randomUUID();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      addClient(controller);
      controller.enqueue(new TextEncoder().encode(`event: connected\ndata: ${JSON.stringify({ id: sessionId })}\n\n`));
      registerSession(sessionId);

      const interval = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(new TextEncoder().encode(':heartbeat\n\n'));
        } catch {
          closed = true;
          clearInterval(interval);
        }
      }, 15000);
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
