import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

interface Provider {
  clientId: string;
  clientSecret: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    } as Provider),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        const user = session.user as User;
        user.id = token.sub as string;
        session.user = user;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
