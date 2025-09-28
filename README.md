# Denotes 🦕

A personal exploration project built with [Deno](https://deno.com).  
I started this in my free time to learn Deno by building:

- A **Tasks API** using Deno KV and Cache API
- A **tiny backend framework** experiment (`Breeze`) with:
  - Routing via `app.get("/path", handler)`
  - Middleware support
  - **File-based routing** (Next.js-style) with `[slug]/route.ts`

This is **not production-ready** — just a playground for learning and experimenting.  
If you’re curious about how frameworks like Express or Hono work under the hood, this code might be interesting to you.

## 🚀 Features so far

- Deno KV storage for CRUD
- Response caching with the Web Cache API
- Custom minimal framework: `Breeze`
- File-based routes with dynamic params (e.g. `/blogs/[slug]`)

## 📂 Structure

src/
├── breeze/ # framework experiment
│ ├── context.ts
│ ├── router.ts
│ ├── fs-router.ts
│ └── routes/ # file-based routes
├── tasks-app/ # CRUD API example
├── main.ts # entry point

````

## 🔧 Usage

```bash
deno task run
````

Then open:

- `GET http://localhost:8000/tasks`
- `GET http://localhost:8000/blogs/hello-world`

## 📝 Status

This is an experiment while I learn Deno.
Future idea → grow into a more complete backend library.

## 🤝 Contributing

This is just me exploring, but feel free to fork, play, and open PRs.
