import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

interface Provider {
  clientId: string;
  clientSecret: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    } as Provider),
  ],
});

export { handler as GET, handler as POST };
