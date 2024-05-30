import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User } from "@prisma/client"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"

type Awaitable<T> = T | Promise<T>

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

        if (!email || !password) {
          throw new Error("All fields are required")
        }
        try {
          const user = await prisma.user.findFirst({
            where: { email }
          })

          if (!user) {
            return null
          }

          const isValidPassword = await compare(password, user.password)

          if (!isValidPassword) {
            return null
          }
          const { password: _, ...restUser } = user

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            companyId: user.companyId
          } as User | any
        } catch (error) {
          throw new Error("An error occurred. Please try again.")
        }

        // const data = await logIn({ email, password })

        // const user = data.user as User

        // if (!user) {
        //   console.log("User doesn't found")

        //   throw new Error(data.message)
        // }
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
      // console.log("User ---->", { user })

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
