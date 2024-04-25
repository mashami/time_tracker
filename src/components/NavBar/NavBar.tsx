"use client"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/utils/context/AppContext"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BreakSvg,
  CaretDownSvg,
  HomeSvg,
  LeavesSvg,
  NotificationSvg,
  ShiftsSvg
} from "../Svg"
import { Button } from "../ui/button"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>("")

  const { userInfo, resetUser } = useAppContext()

  // console.log(userInfo)

  useEffect(() => {
    if (userInfo) {
      setName(userInfo?.name)
    }
  }, [userInfo])

  const pathName = usePathname()

  return (
    <nav className="h-[98px] w-full flex items-center space-x-7 justify-between px-[4.125rem] fixed left-0 right-0 bg-background z-30">
      <Link
        href={"/"}
        className="font-bricolage text-[#006A86] font-bold text-[24px] "
      >
        Time Tracker
      </Link>

      <ul
        className="flex space-x-4 h-8"
        style={{
          borderBottom: "1px solid var(--Gray-200, #EAECF0)"
        }}
      >
        <li
          className={cn(
            "flex items-center border-b border-transparent",
            pathName === "/dashboard" && "border-b-[#006A86]"
          )}
        >
          <Link href={"/dashboard"} className="flex items-center space-x-2">
            <HomeSvg
              color={pathName === "/dashboard" ? "#006A86" : "#667085"}
            />
            <p
              className={cn(
                "text-[#667085] text-[14px] font-semibold leading-5",
                pathName === "/dashboard" && "text-[#006A86]"
              )}
            >
              Home
            </p>
          </Link>
        </li>
        <li
          className={cn(
            "flex items-center border-b border-transparent",
            pathName === "/leaves" && "border-b-[#006A86]"
          )}
        >
          <Link href={"/leaves"} className="flex items-center space-x-2">
            <LeavesSvg color={pathName === "/leaves" ? "#006A86" : "#667085"} />
            <p
              className={cn(
                "text-[#667085] text-[14px] font-semibold leading-5",
                pathName === "/leaves" && "text-[#006A86]"
              )}
            >
              Leaves
            </p>
          </Link>
        </li>

        <li className="flex items-center space-x-2">
          <ShiftsSvg />
          <p className="text-[#667085] text-[14px] font-semibold leading-5">
            Shifts
          </p>
        </li>
        <li className="flex items-center space-x-2">
          <BreakSvg />
          <p className="text-[#667085] text-[14px] font-semibold leading-5">
            Break
          </p>
        </li>
      </ul>

      <div className="flex items-center space-x-[10px]">
        <div className="w-10 h-10 bg-[#F9F9FA] rounded-full flex items-center justify-center">
          <NotificationSvg />
        </div>
        <div
          className="flex items-center space-x-[3.3px] h-10 w-fit"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className="flex items-center space-x-[9px] pr-[13.3px] pl-[6.6px] h-full select-none"
            style={{
              borderRadius: " 46.667px 0px 0px 46.667px",
              background: "#F9F9FA"
            }}
          >
            <div className="w-[27px] h-[27px] rounded-full bg-[#006A86] flex items-center justify-center text-white uppercase">
              {name ? name[0] : ""}
            </div>
            <p className="text-[14px] font-medium leading-[21px]">{name}</p>
          </div>
          <div
            className={cn(
              "px-[13.3px] h-full flex items-center justify-center cursor-pointer "
            )}
            style={{
              borderRadius: "0px 46.667px 46.667px 0px",
              background: "#F9F9FA"
            }}
          >
            <CaretDownSvg
              className={cn(isOpen ? "rotate-180" : "rotate--180")}
            />
          </div>
        </div>
        <Button
          text="Sign out"
          className="text-white"
          onClick={() => {
            signOut({ callbackUrl: "/signin" })
            resetUser()
          }}
        />
      </div>
    </nav>
  )
}

export default NavBar
