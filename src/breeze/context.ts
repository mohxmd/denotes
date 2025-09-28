export class Context {
  constructor(public req: Request) {}

  text(body: string, status = 200) {
    return new Response(body, { status });
  }

  json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  res(body: BodyInit | null, init?: ResponseInit) {
    return new Response(body, init);
  }
}
