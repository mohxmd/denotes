// import { tasksApp } from "./tasks-app/index.ts";

import { Breeze } from "#/breeze/mod.ts";
import { loadFileRoutes } from "./breeze/fs-router.ts";
import { logger } from "./breeze/middlewares.ts";

if (import.meta.main) {
  // Deno.serve(tasksApp);

  const app = new Breeze();
  // load file-based routes
  await loadFileRoutes(app);

  app.use(logger);
  app.get("/", (c) => c.text("Hello from Breeze 🚀"));
  app.get("/json", (c) => c.json({ msg: "Breeze works!" }));

  Deno.serve((req) => app.fetch(req));
}
