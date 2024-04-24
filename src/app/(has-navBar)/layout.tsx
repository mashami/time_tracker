import { NavBar } from "@/components/NavBar"
import React from "react"

interface NavbarPagesLayoutProps {
  children: React.ReactNode
}

const NavbarPagesLayout = ({ children }: NavbarPagesLayoutProps) => {
  return (
    <>
      <div
        className="h-[98px] px-[4.125rem] fixed left-0 right-0 bg-background"
        style={{
          zIndex: "10000"
        }}
      >
        <NavBar />
      </div>

      <section className="px-[14.75rem] pt-[8.875rem] -z-0">{children}</section>
    </>
  )
}

export default NavbarPagesLayout
