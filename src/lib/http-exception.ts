import type { ContentfulStatusCode } from "./utils/http-status.ts";

type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
};

export class HTTPException extends Error {
  readonly res?: Response;
  readonly status: ContentfulStatusCode;

  constructor(
    status: ContentfulStatusCode = 500,
    options?: HTTPExceptionOptions
  ) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }

  getResponse(): Response {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers,
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status,
    });
  }
}
