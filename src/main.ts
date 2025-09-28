import { tasksApp } from "./tasks-app/index.ts";

if (import.meta.main) {
  Deno.serve(tasksApp);
}
