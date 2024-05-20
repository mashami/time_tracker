"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { EdditDepartmentDialog } from "../AddDepartmentDialog"
import DeleteDepartmentDialog from "../DeleteDialog/DeleteDepartmentDialog"
import { DeleteSvg, EditSvg, ThreeDotsSvg } from "../Svg"
interface EditDepartmentProp {
  id: string
  name: string
}

const EditDepartment = ({ id, name }: EditDepartmentProp) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEdditOpen, setIsEdditOpen] = useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0 ring-offset-0 border-none">
          <div
            className="flex items-center justify-center w-[36px] h-[36px] rounded-full cursor-pointer"
            style={{
              border: " 1px solid #CDDFE9"
            }}
          >
            <ThreeDotsSvg />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className=" w-[218px] bg-[#F9F9F9] rounded-[10px] p-[12px] space-y-[12px] ml-48 border border-[#CDDFE9]"
        >
          <DropdownMenuItem
            className=" p-[11.763px] bg-white flex items-center justify-between rounded-lg"
            onClick={() => setIsEdditOpen(true)}
          >
            <p className="text-[14px] leading-6">Edit department</p>
            <EditSvg />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[11.763px] bg-[#FFEFEF] flex  items-center justify-between rounded-lg"
            onClick={() => setIsOpen(true)}
          >
            <p className="text-[14px] leading-6 text-red-500">
              Remove department
            </p>
            <DeleteSvg />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EdditDepartmentDialog
        departmentId={id}
        isOpen={isEdditOpen}
        name={name}
        setIsOpen={setIsEdditOpen}
      />

      <DeleteDepartmentDialog id={id} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default EditDepartment
