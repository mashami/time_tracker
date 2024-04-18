"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  BreakSvg,
  CaretDownSvg,
  HomeSvg,
  LeavesSvg,
  NotificationSvg,
  ShiftsSvg
} from "../Svg"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="h-[98px] w-full flex items-center space-x-7 justify-between">
      <h1 className="font-bricolage text-[#006A86] font-bold text-[24px]">
        Time Tracker
      </h1>
      <ul
        className="flex  space-x-[16px] h-[32px] "
        style={{
          borderBottom: "1px solid var(--Gray-200, #EAECF0)"
        }}
      >
        <li className="flex items-center space-x-2">
          <HomeSvg />
          <p className="text-[#667085] text-[14px] font-semibold leading-5">
            Home
          </p>
        </li>
        <li className="flex items-center space-x-2">
          <LeavesSvg />
          <p className="text-[#667085] text-[14px] font-semibold leading-5">
            Leaves
          </p>
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
            <div className="w-[27px] h-[27px] rounded-full bg-[#006A86] flex items-center justify-center text-white">
              K
            </div>
            <p className="text-[14px] font-medium leading-[21px]">Karigirwa</p>
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
      </div>
    </div>
  )
}

export default NavBar
