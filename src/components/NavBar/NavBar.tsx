"use client"

import { Department, User } from "@prisma/client"
import { useState } from "react"
import { InviteDialog } from "../InviteDialog"
import { NotificationSvg } from "../Svg"
import { Button } from "../ui/button"

interface NavBarProps {
  user: Pick<User, "id" | "companyId" | "name" | "role" | "departmentId">
  departments: Department[]
}

const NavBar = ({ user, departments }: NavBarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <div className="h-[98px] flex items-center  space-x-4 justify-end px-[4.125rem] fixed left-[250px] right-[0px] bg-background z-30 ">
        <div className="w-10 h-10 bg-[#F9F9FA] rounded-full flex items-center justify-center">
          <NotificationSvg />
        </div>
        {(user.role === "Admin" || user.role === "manager") && (
          <Button
            text="Invite Staff"
            className="text-white bg-black hover:bg-black"
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      <InviteDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        departments={departments}
        role={user.role}
        departmentId={user.departmentId}
      />
    </>
  )
}

export default NavBar
