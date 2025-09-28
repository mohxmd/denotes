import { Context } from "./context.ts";

export type Handler = (c: Context) => Response | Promise<Response>;

export type Middleware = (
  c: Context,
  next: () => Promise<Response>
) => Response | Promise<Response>;

export type DynamicHandler = (
  c: Context,
  params: Record<string, string>
) => Response | Promise<Response>;

type Route = { method: string; path: string; handler: Handler };

type DynamicRoute = {
  method: string;
  regex: RegExp;
  keys: string[];
  handler: DynamicHandler;
};

export class Breeze {
  private routes: Route[] = [];
  private middlewares: Middleware[] = [];
  private dynamicRoutes: DynamicRoute[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  private addRoute(method: string, path: string, handler: Handler) {
    this.routes.push({ method, path, handler });
  }

  get(path: string, handler: Handler) {
    this.addRoute("GET", path, handler);
  }

  post(path: string, handler: Handler) {
    this.addRoute("POST", path, handler);
  }

  put(path: string, handler: Handler) {
    this.addRoute("PUT", path, handler);
  }

  delete(path: string, handler: Handler) {
    this.addRoute("DELETE", path, handler);
  }

  addDynamicRoute(
    method: string,
    regex: RegExp,
    keys: string[],
    handler: DynamicHandler
  ) {
    this.dynamicRoutes.push({ method, regex, keys, handler });
  }

  fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const c = new Context(req);

    // --- Static route match ---
    const route = this.routes.find(
      (r) => r.method === req.method && r.path === pathname
    );

    // Runner for middleware chain
    let i = -1;
    const runner = async (index: number): Promise<Response> => {
      if (index <= i) throw new Error("next() called multiple times");
      i = index;

      if (index < this.middlewares.length) {
        const mw = this.middlewares[index];
        return await mw(c, () => runner(index + 1));
      }

      // If no more middlewares → run route/dynamic
      if (route) {
        return await route.handler(c);
      }

      // --- Dynamic route match ---
      for (const r of this.dynamicRoutes) {
        if (r.method !== req.method) continue;
        const match = pathname.match(r.regex);
        if (match) {
          const params: Record<string, string> = {};
          r.keys.forEach((key, i) => {
            params[key] = match[i + 1];
          });
          return await r.handler(c, params);
        }
      }

      return new Response("Not Found", { status: 404 });
    };

    return runner(0);
  }
}
