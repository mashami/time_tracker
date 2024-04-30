"use client"

import { cn } from "@/lib/utils"
import { useAppContext } from "@/utils/context/AppContext"
import { Role } from "@prisma/client"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { InviteDialog } from "../InviteDialog"
import { Loader } from "../Loader"
import {
  AnnouncementSvg,
  ArrowRighSvg,
  BreaksSvg,
  DashboardSvg,
  LeaveSvg,
  LogOutSvg,
  MemberSvg
} from "../Svg"

const Menu = () => {
  const [name, setName] = useState<string | undefined>("")
  const [companyId, setCompanyId] = useState<string>("")
  const [role, setRole] = useState<Role>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const path = usePathname()
  const { userInfo, resetUser } = useAppContext()

  // console.log(userInfo)

  useEffect(() => {
    if (userInfo) {
      setName(userInfo?.name)
      setRole(userInfo.role)
      setCompanyId(userInfo.companyId)
    }
  }, [userInfo])

  return (
    <>
      <menu className="w-full h-full relative">
        <div className="w-full space-y-10">
          <div className="py-[26px] pl-[25px] flex items-center w-full">
            <Link
              href={"/"}
              className="font-bricolage text-[#006A86] font-bold text-[24px]"
            >
              Time Tracker
            </Link>
          </div>
          <div className="px-[17px] space-y-4">
            {role === "Admin" ? (
              <Link
                href={"/members"}
                className={cn(
                  path === "/members" && "bg-[#F9F9F9]",
                  "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
                )}
                // onClick={() => router.push("/members")}
              >
                <MemberSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer">
                  Members
                </p>
              </Link>
            ) : (
              <Link
                href={"/dashboard"}
                className={cn(
                  path === "/dashboard" && "bg-[#F9F9F9]",
                  "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
                )}
                // onClick={() => router.push("/dashboard")}
              >
                <DashboardSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer">
                  Dashaboard
                </p>
              </Link>
            )}

            <Link
              href={"/announcements"}
              className={cn(
                path === "/announcements" && "bg-[#F9F9F9]",
                "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
              )}
              // onClick={() => router.push("/announcements")}
            >
              <AnnouncementSvg />
              <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer">
                Announcement
              </p>
            </Link>

            <Link
              href={"/leaves"}
              className={cn(
                path === "/leaves" && "bg-[#F9F9F9]",
                "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
              )}
              // onClick={() => router.push("/leaves")}
            >
              <LeaveSvg />
              <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer rounded-md">
                Leave
              </p>
            </Link>

            <div className="p-[10px] flex items-center justify-between rounded-md ">
              <div className="flex items-center space-x-[10px]">
                <BreaksSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5">
                  Break
                </p>
              </div>
              <div className="flex items-center justify-center h-5 px-3 rounded-full bg-[#006A86]">
                <p className="font-medium leading-[10px] text-[8px] text-white">
                  Comming soon
                </p>
              </div>
            </div>
            <div className="p-[10px] flex items-center justify-between rounded-md ">
              <div className="flex items-center space-x-[10px]">
                <BreaksSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5">
                  Shift
                </p>
              </div>
              <div className="flex items-center justify-center h-5 px-3 rounded-full bg-[#006A86]">
                <p className="font-medium leading-[10px] text-[8px] text-white">
                  Comming soon
                </p>
              </div>
            </div>
            {role === "Admin" && (
              <div className="pt-[79px]">
                <div
                  className="p-[10px] flex items-center  space-x-[10px] bg-[#F9F9F9] cursor-pointer rounded-md"
                  onClick={() => setIsOpen(true)}
                >
                  <p className="text-black text-[14px] font-medium leading-5 cursor-pointer rounded-md">
                    Invite Staff
                  </p>
                  <ArrowRighSvg color="black" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-10 w-full">
          <div className="flex items-center space-x-[7px] px-[17px]">
            <div className=" flex flex-1 items-center space-x-[9px] pr-[13.3px] pl-[6.6px] py-[6.6px] h-full bg-[#F9F9FA] select-none rounded-[16px]">
              <div className="w-[27px] h-[27px] rounded-full bg-[#006A86] flex items-center justify-center text-white uppercase">
                {name ? name[0] : <Loader />}
              </div>
              <p className="text-[14px] font-medium leading-[21px]">
                {name ? name : <Loader />}
              </p>
            </div>
            <div
              className="w-[40px] h-[40px] cursor-pointer rounded-full bg-[#F9F9FA] hover:bg-[#F9F9FA]/60 flex items-center justify-center text-white uppercase"
              onClick={() => {
                resetUser()
                signOut({ callbackUrl: "/signin" })
              }}
            >
              <LogOutSvg />
            </div>
          </div>
        </div>
      </menu>

      <InviteDialog
        companyId={companyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

export default Menu
