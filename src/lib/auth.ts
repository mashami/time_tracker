import { HttpStatusCode } from "@/utils/enums"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server"
import { prisma } from "./prisma"

import { User } from "@prisma/client"
import { compare } from "bcryptjs"

// type Awaitable<T> = T | Promise<T>;

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

        if (!email || !password) {
          return NextResponse.json(
            { error: true, message: "All fields are required" },
            { status: HttpStatusCode.BAD_REQUEST }
          )
        }
        try {
          const user = await prisma.user.findFirst({
            where: { email }
          })

          if (!user) {
            return NextResponse.json(
              { error: true, message: "User with email does not exists." },
              { status: HttpStatusCode.BAD_REQUEST }
            )
          }

          const comparePasswords = await compare(password, user.password)

          if (!comparePasswords) {
            return NextResponse.json(
              { error: true, message: "Incorrect password." },
              { status: HttpStatusCode.BAD_REQUEST }
            )
          }
          const { password: _, ...restUser } = user

          if (!user) {
            console.log("User doesn't found")

            return NextResponse.json(
              { error: true, message: "User doesn't found" },
              { status: HttpStatusCode.BAD_REQUEST }
            )
          }

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            companyId: user.companyId
          } as User | any
        } catch (error) {
          console.log(error)
          return NextResponse.json(
            { error: true, message: "An error occured. Please try again." },
            { status: HttpStatusCode.INTERNAL_SERVER }
          )
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
