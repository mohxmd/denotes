import { Context } from "#/breeze/context.ts";

export function GET(c: Context, params: { slug: string }) {
  return c.json({ blog: c.req.url, slug: params.slug });
}
