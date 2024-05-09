import { logIn } from "@/services/user"
import { User } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),

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
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          companyId: user.companyId
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

      const mergedUser = {
        ...sessionUser,
        id: t.id,
        name: t.name,
        companyId: t.companyId,
        role: t.role,
        email: t.email
      }

      // console.log({ mergedUser })

      return {
        ...rest,
        user: mergedUser
      }
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          companyId: user.companyId,
          role: user.role,
          email: user.email
        }
      }

      return token
    }
  },

  secret: process.env.NEXTAUTH_SECRET
}
