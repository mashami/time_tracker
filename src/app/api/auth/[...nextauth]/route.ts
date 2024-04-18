import { prisma } from "@/lib/prisma"
import { logIn } from "@/services/user"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User } from "@prisma/client"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      type: "credentials",

      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        const data = await logIn({ email, password })

        const user = data.user as User

        if (!user) {
          console.log("User doesn't found")

          throw new Error(data.message)
        }

        return {
          id: user.id
        }
      }
    })
  ],

  pages: {
    signIn: "/signin"
  },

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async session({ session, token }) {
      // Destructure user from the session callback
      const { user: sessionUser, ...rest } = session
      const t = token as unknown as any

      // Merge the user object from session callback and token
      const mergedUser = {
        ...sessionUser,
        id: t.id
      }

      // Return the updated session object
      return {
        ...rest,
        user: mergedUser
      }
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id
        }
      }

      return token
    }
  },

  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
