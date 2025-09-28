import type { Task } from "./_types.ts";

export function withCors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(res.body, { status: res.status, headers: h });
}

export const json = (data: unknown, status = 200, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extra,
    },
  });

export function isTaskPayload(
  x: unknown
): x is Partial<Task> & { title?: string } {
  return typeof x === "object" && x !== null;
}

// Invalidate cached GET responses when data changes
export async function invalidateTaskCaches(
  cache: Cache,
  origin: string,
  id?: string
) {
  // Invalidate the list cache
  await cache.delete(new Request(`${origin}/tasks`), { ignoreSearch: true });
  if (id) {
    // Invalidate the item cache
    await cache.delete(new Request(`${origin}/tasks/${id}`), {
      ignoreSearch: true,
    });
  }
}
