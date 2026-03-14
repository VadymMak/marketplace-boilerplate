import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import { redirect } from "next/navigation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        // Simple password check — in production use bcrypt
        // We'll add bcrypt in Phase 9 (Polish)
        const isValid = user.password === credentials.password;
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
});

// ============================================
// ROLE GUARD HELPERS
// ============================================

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return session;
}

export async function requireRole(role: "VENDOR" | "ADMIN") {
  const session = await auth();
  if (!session || session.user.role !== role) redirect("/auth/login");
  return session;
}
