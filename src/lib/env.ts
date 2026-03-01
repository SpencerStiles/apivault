import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Allow skipping validation in CI environments where env vars may be stubs
export const env =
  process.env.SKIP_ENV_VALIDATION === 'true'
    ? (process.env as unknown as z.infer<typeof schema>)
    : schema.parse(process.env);
