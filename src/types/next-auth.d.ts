import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's id && name*/
      id: string
      name: string
    }
  }
}
