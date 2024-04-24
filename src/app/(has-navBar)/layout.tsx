import { NavBar } from "@/components/NavBar"
import React from "react"

interface NavbarPagesLayoutProps {
  children: React.ReactNode
}

const NavbarPagesLayout = ({ children }: NavbarPagesLayoutProps) => {
  return (
    <>
      <div>
        <NavBar />
      </div>

      <section className="max-w-[968px] mx-auto pt-[8.875rem] pb-8 z-0">
        {children}
      </section>
    </>
  )
}

export default NavbarPagesLayout
