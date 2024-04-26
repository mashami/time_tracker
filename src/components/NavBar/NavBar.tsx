"use client"

import { useAppContext } from "@/utils/context/AppContext"
import { Role } from "@prisma/client"
import { useEffect, useState } from "react"
import { InviteDialog } from "../InviteDialog"
import { NotificationSvg } from "../Svg"
import { Button } from "../ui/button"

const NavBar = () => {
  const { userInfo } = useAppContext()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [companyId, setCompanyId] = useState<string>("")
  const [role, setRole] = useState<Role>()

  useEffect(() => {
    if (userInfo) {
      setCompanyId(userInfo?.companyId)
      setRole(userInfo.role)
    }
  }, [userInfo])

  return (
    <>
      <div className="h-[98px] flex items-center  space-x-4 justify-end px-[4.125rem] fixed left-[250px] right-[0px] bg-background z-30 ">
        <div className="w-10 h-10 bg-[#F9F9FA] rounded-full flex items-center justify-center">
          <NotificationSvg />
        </div>
        {role === "Admin" && companyId && (
          <Button
            text="Invite Staff"
            className="text-white bg-black hover:bg-black"
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>
      <InviteDialog
        companyId={companyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

export default NavBar
