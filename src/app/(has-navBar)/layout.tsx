import { NavBar } from "@/components/NavBar"
import { Toaster } from "@/components/ui/toaster"
import React from "react"

interface NavbarPagesLayoutProps {
  children: React.ReactNode
}

const NavbarPagesLayout = ({ children }: NavbarPagesLayoutProps) => {
  return (
    <>
      <div className="h-[98px] px-[4.125rem] fixed left-0 right-0 bg-background ">
        <NavBar />
      </div>
      <section className="px-[14.75rem] pt-[8.875rem]">{children}</section>
      <Toaster />
    </>
  )
}

export default NavbarPagesLayout
