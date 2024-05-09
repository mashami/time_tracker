import "next-auth"
import type { DefaultSession } from "next-auth"
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      name: string
      companyId: string
      role: string
    }
  }
  interface User extends DefaultUser {
    companyId: string
    role: string
  }
}
