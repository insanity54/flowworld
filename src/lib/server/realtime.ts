type SSEClient = {
  controller: ReadableStreamDefaultController;
  encoder: TextEncoder;
};

type SessionData = {
  lastBeat: number;
  color: string;
};

const sseClients = new Set<SSEClient>();
const activeSessions = new Map<string, SessionData>();

const SWEEP_MS = 5000;
const TTL_MS = 15000;

function broadcastSessions() {
  const sessions = Array.from(activeSessions.entries()).map(([id, s]) => ({
    id,
    color: s.color,
  }));
  broadcast('clients', { count: sessions.length, sessions });
}

setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [id, data] of activeSessions) {
    if (now - data.lastBeat > TTL_MS) {
      activeSessions.delete(id);
      changed = true;
    }
  }
  if (changed) broadcastSessions();
}, SWEEP_MS);

export function registerSession(id: string): void {
  activeSessions.set(id, { lastBeat: Date.now(), color: '#ffffff' });
  broadcastSessions();
}

export function heartbeat(id: string): void {
  const session = activeSessions.get(id);
  if (session) session.lastBeat = Date.now();
}

export function updateColor(id: string, color: string): void {
  const session = activeSessions.get(id);
  if (session) {
    session.color = color;
    broadcastSessions();
  }
}

export function addClient(controller: ReadableStreamDefaultController): void {
  sseClients.add({ controller, encoder: new TextEncoder() });
}

export function broadcast(event: string, data: unknown): void {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of [...sseClients]) {
    try {
      client.controller.enqueue(client.encoder.encode(message));
    } catch {
      sseClients.delete(client);
    }
  }
}
