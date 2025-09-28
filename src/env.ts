import { z } from "@zod/zod";
import { logger } from "#/lib/utils/logger.ts";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const processEnv = EnvSchema.safeParse(Deno.env.toObject());

if (!processEnv.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(
    JSON.stringify(z.flattenError(processEnv.error).fieldErrors, null, 2),
  );
  Deno.exit(1);
}

const env = processEnv.data;

export default env;
export type Env = z.infer<typeof EnvSchema>;
