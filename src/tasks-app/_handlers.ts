import type { Task } from "./_types.ts";
import { invalidateTaskCaches, isTaskPayload, json } from "./_utils.ts";

const kv = await Deno.openKv();
const cache = await caches.open("api-cache");

export async function listTasks(req: Request) {
  const cached = await cache.match(req);
  if (cached) return cached;

  const tasks: Task[] = [];
  for await (const entry of kv.list<Task>({ prefix: ["task"] })) {
    tasks.push(entry.value);
  }

  const res = json(tasks, 200, { "Cache-Control": "public, max-age=60" });

  // Store in HTTP cache
  await cache.put(req, res.clone());
  return res;
}

export async function getTask(req: Request, id: string) {
  const cached = await cache.match(req);
  if (cached) return cached;

  const r = await kv.get<Task>(["task", id]);
  if (!r.value) return new Response("Not found", { status: 404 });

  const res = json(r.value, 200, { "Cache-Control": "public, max-age=60" });
  await cache.put(req, res.clone());
  return res;
}

export async function createTask(req: Request) {
  const origin = new URL(req.url).origin;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!isTaskPayload(body) || typeof body.title !== "string") {
    return json({ error: "Expected { title: string }" }, 422);
  }

  const id = crypto.randomUUID();
  const task: Task = { id, title: body.title, done: false };

  await kv.set(["task", id], task);
  await invalidateTaskCaches(cache, origin, id);

  return json(task, 201);
}

export async function updateTask(req: Request, id: string) {
  const origin = new URL(req.url).origin;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!isTaskPayload(body)) {
    return json({ error: "Invalid payload" }, 422);
  }

  const prev = await kv.get<Task>(["task", id]);
  if (!prev.value) return new Response("Not found", { status: 404 });

  const task: Task = {
    id,
    title: typeof body.title === "string" ? body.title : prev.value.title,
    done: typeof body.done === "boolean" ? body.done : prev.value.done,
  };

  await kv.set(["task", id], task);
  await invalidateTaskCaches(cache, origin, id);

  return json(task);
}

export async function deleteTask(req: Request, id: string) {
  const origin = new URL(req.url).origin;
  await kv.delete(["task", id]);
  await invalidateTaskCaches(cache, origin, id);
  return new Response(null, { status: 204 });
}
