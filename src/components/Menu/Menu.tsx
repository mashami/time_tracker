"use client"

import { cn } from "@/lib/utils"
import type { Department, User } from "@prisma/client"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { InviteDialog } from "../InviteDialog"

import { PaymentDialog } from "../PaymentDialog"
import {
  AnnouncementSvg,
  ArrowRighSvg,
  BreaksSvg,
  DashboardSvg,
  DepartmentSvg,
  LeaveSvg,
  LogOutSvg,
  MemberSvg
} from "../Svg"

interface SideMenuProps {
  departments: Department[]
  user: Pick<
    User,
    "id" | "companyId" | "name" | "role" | "departmentId" | "email"
  > & {
    Company: {
      name: string
    }
  }
}

const SideMenu = ({ departments, user }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false)

  const path = usePathname()

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
            {user.role === "Admin" && (
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
            )}

            {(user.role === "Staff" || user.role === "manager") && (
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
                  Dashboard
                </p>
              </Link>
            )}

            <Link
              href={"/announcements"}
              className={cn(
                path === "/announcements" && "bg-[#F9F9F9]",
                "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
              )}
            >
              <AnnouncementSvg />
              <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer">
                Announcement
              </p>
            </Link>

            {user.role === "Admin" && (
              <Link
                href={"/departments"}
                className={cn(
                  path === "/departments" && "bg-[#F9F9F9]",
                  "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
                )}
              >
                <DepartmentSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer">
                  Department
                </p>
              </Link>
            )}

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
            {user.role !== "Admin" && (
              <Link
                href={`/messages/${user.departmentId}`}
                className={cn(
                  path.includes("/messages") && "bg-[#F9F9F9]",
                  "p-[10px] flex items-center space-x-[10px] hover:bg-[#F9F9F9] cursor-pointer rounded-md"
                )}
              >
                <LeaveSvg />
                <p className="text-[#667085] text-[14px] font-semibold leading-5 cursor-pointer rounded-md">
                  Chats
                </p>
              </Link>
            )}

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
                  Coming soon
                </p>
              </div>
            </div>

            {user.role === "Admin" && (
              <div className="pt-[79px]">
                <div
                  className="p-[10px] flex items-center justify-between bg-[#F9F9F9] cursor-pointer rounded-md"
                  onClick={() => setIsOpen(true)}
                >
                  <p className="text-black text-[14px] font-medium leading-5 cursor-pointer rounded-md">
                    Invite Staff
                  </p>
                  <ArrowRighSvg color="black" />
                </div>
              </div>
            )}

            {user.role === "Admin" && (
              <div className="pt-[0px]">
                <div
                  className="p-[10px] flex items-center justify-between  bg-[#F9F9F9] cursor-pointer rounded-md"
                  onClick={() => setIsPaymentOpen(true)}
                >
                  <p className="text-black text-[14px] font-medium leading-5 cursor-pointer rounded-md">
                    Payment
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
                {user.name === "Admin" ? user.Company.name[0] : user.name[0]}
              </div>
              <p className="text-[14px] font-medium leading-[21px]">
                {user.name === "Admin" ? user.Company.name : user.name}
              </p>
            </div>
            <div
              className="relative group w-[40px] h-[40px] cursor-pointer rounded-full bg-[#F9F9FA] hover:bg-[#F9F9FA]/60 flex items-center justify-center"
              onClick={() => {
                // resetUser()
                signOut({ callbackUrl: "/signin" })
              }}
            >
              <p className="hidden group-hover:flex absolute -top-6 text-[10px] text-black py-2">
                Log out
              </p>
              <LogOutSvg />
            </div>
          </div>
        </div>
      </menu>

      <InviteDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        departments={departments}
        role={user.role}
        departmentId={user.departmentId}
      />

      <PaymentDialog
        companyId={user.companyId}
        isOpen={isPaymentOpen}
        setIsOpen={setIsPaymentOpen}
        email={user.email}
      />
    </>
  )
}

export default SideMenu
