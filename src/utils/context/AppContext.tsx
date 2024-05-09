"use client"

import { getUserInfo } from "@/services/user"
import { User } from "@prisma/client"
import { createContext, useContext, useState } from "react"

interface AppContextData {
  userInfo: User | null
  fetchUser: () => void
  resetUser: () => void
}

const AppContext = createContext<AppContextData | null>(null)

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }

  return context
}

interface AppContextProviderProps {
  children: React.ReactNode
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [userInfo, setUserInfo] = useState<User | null>(null)

  const fetchUser = async () => {
    try {
      const result = await getUserInfo()
      const user = result.user

      setUserInfo(user)
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  // console.log(userInfo)

  const value: AppContextData = {
    userInfo,

    fetchUser,
    resetUser: () => setUserInfo(null)
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
