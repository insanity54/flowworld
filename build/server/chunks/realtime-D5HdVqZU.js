const sseClients = /* @__PURE__ */ new Set();
const activeSessions = /* @__PURE__ */ new Map();
const SWEEP_MS = 5e3;
const TTL_MS = 15e3;
function broadcastSessions() {
  const sessions = Array.from(activeSessions.entries()).map(([id, s]) => ({
    id,
    color: s.color
  }));
  broadcast("clients", { count: sessions.length, sessions });
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
function registerSession(id) {
  activeSessions.set(id, { lastBeat: Date.now(), color: "#ffffff" });
  broadcastSessions();
}
function heartbeat(id) {
  const session = activeSessions.get(id);
  if (session) session.lastBeat = Date.now();
}
function updateColor(id, color) {
  const session = activeSessions.get(id);
  if (session) {
    session.color = color;
    broadcastSessions();
  }
}
function addClient(controller) {
  sseClients.add({ controller, encoder: new TextEncoder() });
}
function broadcast(event, data) {
  const message = `event: ${event}
data: ${JSON.stringify(data)}

`;
  for (const client of [...sseClients]) {
    try {
      client.controller.enqueue(client.encoder.encode(message));
    } catch {
      sseClients.delete(client);
    }
  }
}

export { addClient as a, broadcast as b, heartbeat as h, registerSession as r, updateColor as u };
//# sourceMappingURL=realtime-D5HdVqZU.js.map
