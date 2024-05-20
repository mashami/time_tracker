"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { DeleteUserDialog } from "../DeleteDialog"
import { CaretDownSvg, DeleteSvg } from "../Svg"
import MakeUserManagerDialog from "./MakeUserManagerDialog"

interface EditUserDropdownProp {
  userId: string
  department: string | null
  departmentId: string
}

const EditUserDropdown = ({
  userId,
  department,
  departmentId
}: EditUserDropdownProp) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEdditOpen, setIsEdditOpen] = useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0 ring-offset-0 border-none">
          <CaretDownSvg className={cn(isOpen && "rotate-180")} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className=" w-[218px] bg-[#F9F9F9] rounded-[10px] p-[12px] space-y-[12px] ml-48 border border-[#CDDFE9]"
        >
          <DropdownMenuItem
            className=" p-[11.763px] bg-white rounded-lg"
            onClick={() => setIsEdditOpen(true)}
          >
            <p className="text-[14px] leading-6">Make Manager</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[11.763px] bg-[#FFEFEF] flex  items-center justify-between rounded-lg"
            onClick={() => setIsOpen(true)}
          >
            <p className="text-[14px] leading-6 text-red-500">Remove member</p>
            <DeleteSvg />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteUserDialog id={userId} isOpen={isOpen} setIsOpen={setIsOpen} />
      <MakeUserManagerDialog
        isOpen={isEdditOpen}
        setIsOpen={setIsEdditOpen}
        nameDepartment={department}
        userId={userId}
        departmentId={departmentId}
      />
    </>
  )
}

export default EditUserDropdown
