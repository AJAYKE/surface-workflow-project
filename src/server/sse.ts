// --- SSE fanout (in-memory; fine locally; swap to Redis in prod) ---
const clients = new Set<WritableStreamDefaultWriter<string>>();

export function broadcast(data: string) {
  for (const w of clients) {
    w.write(`data: ${data}\n\n`).catch(() => clients.delete(w));
  }
}

export function addClient(w: WritableStreamDefaultWriter<string>) {
  clients.add(w);
}

export function removeClient(w: WritableStreamDefaultWriter<string>) {
  clients.delete(w);
}
