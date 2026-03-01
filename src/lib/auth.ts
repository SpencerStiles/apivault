// NOTE: Run `pnpm install` after adding next-auth and @auth/prisma-adapter to package.json
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { db } from './db';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        // In production, look up the user and verify their hashed password.
        // For now, return null to enforce OAuth-only sign-in.
        return null;
      },
    }),
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
