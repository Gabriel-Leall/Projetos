import { NextAuthOptions, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Adapter, AdapterUser } from "next-auth/adapters";
// Import prisma in runtime, not build time
// import { prisma } from "./db";

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}

// Define session types for better type safety
interface SessionData {
  sessionToken: string;
  userId: string;
  expires: Date;
}

// We'll create and initialize the auth options dynamically
export const authOptions: NextAuthOptions = {
  adapter: {
    // This will be initialized during runtime, not build
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const { prisma } = await import("./db");
      return await prisma.user.create({ data: user }) as AdapterUser;
    },
    async getUser(id: string): Promise<AdapterUser | null> {
      const { prisma } = await import("./db");
      return await prisma.user.findUnique({ where: { id } }) as AdapterUser | null;
    },
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const { prisma } = await import("./db");
      return await prisma.user.findUnique({ where: { email } }) as AdapterUser | null;
    },
    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }): Promise<AdapterUser | null> {
      const { prisma } = await import("./db");
      const account = await prisma.account.findUnique({
        where: { 
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        },
        include: { user: true },
      });
      return (account?.user as AdapterUser) ?? null;
    },
    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const { prisma } = await import("./db");
      return await prisma.user.update({ where: { id: user.id }, data: user }) as AdapterUser;
    },
    async deleteUser(userId: string): Promise<AdapterUser | null> {
      const { prisma } = await import("./db");
      return await prisma.user.delete({ where: { id: userId } }) as AdapterUser;
    },
    async linkAccount(account: Account): Promise<Account | null> {
      const { prisma } = await import("./db");
      return await prisma.account.create({ data: account }) as Account;
    },
    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }) {
      const { prisma } = await import("./db");
      return await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        }
      });
    },
    async createSession(session: SessionData): Promise<SessionData> {
      const { prisma } = await import("./db");
      return await prisma.session.create({ data: session }) as SessionData;
    },
    async getSessionAndUser(sessionToken: string): Promise<{ session: SessionData, user: AdapterUser } | null> {
      const { prisma } = await import("./db");
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user: user as AdapterUser, session: session as SessionData };
    },
    async updateSession(session: Partial<{ sessionToken: string }> & { sessionToken: string }): Promise<SessionData | null> {
      const { prisma } = await import("./db");
      return await prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: session,
      }) as SessionData | null;
    },
    async deleteSession(sessionToken: string) {
      const { prisma } = await import("./db");
      return await prisma.session.delete({ where: { sessionToken } });
    },
  } as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      try {
        const { prisma } = await import("./db");
        
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
      } catch (error) {
        console.error("JWT callback error:", error);
        // Return the token as is if there's an error
        return token;
      }
    },
  },
}; 