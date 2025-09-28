import { Context } from "./context.ts";
import { logger as lg } from "#/lib/utils/logger.ts";

export const logger = async (c: Context, next: () => Promise<Response>) => {
  lg.info(`${c.req.method} ${new URL(c.req.url).pathname}`);
  return await next();
};

export const cors =
  (allowedOrigin = "*") =>
  async (_c: Context, next: () => Promise<Response>) => {
    const res = await next();
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    return new Response(res.body, { ...res, headers });
  };
