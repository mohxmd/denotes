import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "./_handlers.ts";
import { json, withCors } from "./_utils.ts";

export async function tasksApp(req: Request) {
  if (req.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  const { pathname } = new URL(req.url);

  try {
    if (req.method === "GET" && pathname === "/tasks") {
      return withCors(await listTasks(req));
    }

    if (req.method === "POST" && pathname === "/tasks") {
      return withCors(await createTask(req));
    }

    if (pathname.startsWith("/tasks/")) {
      const id = pathname.split("/")[2];
      if (!id) return withCors(new Response("Bad Request", { status: 400 }));

      if (req.method === "GET") return withCors(await getTask(req, id));
      if (req.method === "PUT") return withCors(await updateTask(req, id));
      if (req.method === "DELETE") return withCors(await deleteTask(req, id));
    }

    return withCors(new Response("Not Found", { status: 404 }));
  } catch (err) {
    console.error(err);
    return withCors(json({ error: "Internal Server Error" }, 500));
  }
}

/**
 *  # GET  /tasks
 *  # POST /tasks         { "title": "Learn Deno" }
 *  # GET  /tasks/:id
 *  # PUT  /tasks/:id     { "title": "New title", "done": true }
 *  # DELETE /tasks/:id
 */
