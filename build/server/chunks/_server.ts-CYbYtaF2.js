import { a as addClient, r as registerSession } from './realtime-D5HdVqZU.js';

function GET() {
  const sessionId = crypto.randomUUID();
  let closed = false;
  const stream = new ReadableStream({
    start(controller) {
      addClient(controller);
      controller.enqueue(new TextEncoder().encode(`event: connected
data: ${JSON.stringify({ id: sessionId })}

`));
      registerSession(sessionId);
      const interval = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(new TextEncoder().encode(":heartbeat\n\n"));
        } catch {
          closed = true;
          clearInterval(interval);
        }
      }, 15e3);
    },
    cancel() {
      closed = true;
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}

export { GET };
//# sourceMappingURL=_server.ts-CYbYtaF2.js.map
