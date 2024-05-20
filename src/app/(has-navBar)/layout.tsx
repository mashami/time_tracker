import { Menu } from "@/components/Menu"
import { NavBar } from "@/components/NavBar"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

import React from "react"

interface NavbarPagesLayoutProps {
  children: React.ReactNode
}

const NavbarPagesLayout = async ({ children }: NavbarPagesLayoutProps) => {
  const sessionUser = await getCurrentUser()

  console.log(sessionUser)

  if (!sessionUser) {
    throw new Error("User not found")
  }

  const user = (await prisma.user.findFirst({
    where: { id: sessionUser?.id },
    select: {
      id: true,
      companyId: true,
      name: true,
      role: true,
      departmentId: true,
      Company: {
        select: {
          name: true
        }
      }
    }
  })) as any

  if (!user) {
    throw new Error("User not found")
  }

  const companyId = sessionUser.companyId

  const departments = await prisma.department.findMany({
    where: {
      companyId
    }
  })

  return (
    <main>
      <div
        className="w-[244px] h-screen fixed"
        style={{
          borderRight: " 1px solid rgba(238, 238, 238, 0.93)"
        }}
      >
        <Menu departments={departments} user={user} />
      </div>
      <div>
        <NavBar user={user} departments={departments} />
      </div>

      <section className="max-w-[968px] ml-[333px] pt-[120px] pb-8 z-0 ">
        {children}
      </section>
    </main>
  )
}

export default NavbarPagesLayout
