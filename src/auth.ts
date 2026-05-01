import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import bcryptjs from "bcryptjs";

async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: {email: email}
  })
}
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parasedCredentials = z
        .object({ email: z.string().email(),
          password: z.string().min(8) })
        .safeParse(credentials);

        if (parasedCredentials.success) {
          const {email, password} = parasedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcryptjs.compare(password, user.password);
          if(passwordsMatch) return user;
        }
        return null;
      }
    })],
});