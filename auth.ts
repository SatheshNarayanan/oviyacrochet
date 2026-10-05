import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role?: string;
    theme?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      theme: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          theme: user.theme ?? "system",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["id"] = user.id;
        token["role"] = user.role;
        token["theme"] = user.theme ?? "system";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token["id"] as string;
        session.user.role = token["role"] as string;
        session.user.theme = (token["theme"] as string) ?? "system";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
});
