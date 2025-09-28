import { Context } from "./context.ts";
import { Breeze } from "./router.ts";
import { join, relative } from "@std/path";

export const ROUTES_DIR = join(Deno.cwd(), "src", "breeze", "routes");

type RouteModule = Record<
  string,
  (c: Context, params?: Record<string, string>) => Response | Promise<Response>
>;

// Convert `[slug]` to a param matcher
function pathToRegex(path: string) {
  const keys: string[] = [];
  const regex = path
    .replace(/\[(.+?)\]/g, (_, key) => {
      keys.push(key);
      return "([^/]+)";
    })
    .replace(/\/$/, ""); // no trailing slash
  return { regex: new RegExp(`^${regex}$`), keys };
}

export async function loadFileRoutes(app: Breeze) {
  for await (const entry of Deno.readDir(ROUTES_DIR)) {
    await walkDir(entry.name, "");
  }

  async function walkDir(dir: string, prefix: string) {
    const fullPath = join(ROUTES_DIR, dir);
    for await (const entry of Deno.readDir(fullPath)) {
      if (entry.isDirectory) {
        await walkDir(join(dir, entry.name), join(prefix, "/", entry.name));
      } else if (entry.name === "route.ts") {
        const routePath = join(fullPath, entry.name);
        const module: RouteModule = await import("file://" + routePath);

        // Build URL pattern (e.g. blogs/[slug]/route.ts -> /blogs/:slug)
        const rel = "/" + relative(ROUTES_DIR, fullPath).replaceAll("\\", "/");
        const { regex, keys } = pathToRegex(rel);

        for (const method of ["GET", "POST", "PUT", "DELETE"]) {
          if (module[method]) {
            app.addDynamicRoute(method, regex, keys, module[method]);
          }
        }
      }
    }
  }
}
