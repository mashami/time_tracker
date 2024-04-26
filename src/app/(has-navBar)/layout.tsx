import { Menu } from "@/components/Menu"
import { NavBar } from "@/components/NavBar"

import React from "react"

interface NavbarPagesLayoutProps {
  children: React.ReactNode
}

const NavbarPagesLayout = ({ children }: NavbarPagesLayoutProps) => {
  return (
    <main>
      <div
        className="w-[244px] h-screen fixed"
        style={{
          borderRight: " 1px solid rgba(238, 238, 238, 0.93)"
        }}
      >
        <Menu />
      </div>
      <div>
        <NavBar />
      </div>

      <section className="max-w-[968px] ml-[333px] pt-[120px] pb-8 z-0">
        {children}
      </section>
    </main>
  )
}

export default NavbarPagesLayout
