"use client"
import { authOptions } from "@/lib/auth"
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { createContext, useContext, useState } from "react"

interface AppContextData {
  name: string
  id: string
}

const AppContext = createContext<AppContextData | null>(null)

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider")
  }

  return context
}

interface AppContextProviderProps {
  children: React.ReactNode
}

export const AppContextProvider = async ({
  children
}: AppContextProviderProps) => {
  const [name, setName] = useState<string>("")
  const [id, setId] = useState<string>("")

  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }

  setId(session.user.id)
  setName(session.user.name)

  console.log(id)
  console.log(name)

  const value: AppContextData = {
    id,
    name
  }
  return (
    <AppContext.Provider value={value}>
      <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
    </AppContext.Provider>
  )
}
