import { Context } from "#/breeze/context.ts";

export function GET(c: Context) {
  return c.json([{ id: 1, title: "My first blog" }]);
}

export async function POST(c: Context) {
  const body = await c.req.json();
  return c.json({ msg: "Blog created", body });
}
