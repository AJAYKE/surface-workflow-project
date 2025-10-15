import { addClient } from "~/server/sse";

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  addClient(writer);
  await writer.write("event: ping\ndata: connected\n\n");
  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
