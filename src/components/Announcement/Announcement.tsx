"use client"

import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/helpers"
import { Role } from "@prisma/client"
import { DeleteAnnouncemetDialog } from "../DeleteDialog"

interface AnnouncementProps {
  date: Date
  description: string
  owner: string
  role: Role
  id: string
}
const AnnouncementCop = ({
  date,
  description,
  owner,
  role,
  id
}: AnnouncementProps) => {
  return (
    <div className="space-y-[10px] px-[10px] pt-[6px] border border-[#CDDFE9] rounded-[10px]">
      <div className="flex items-center justify-between pb-[4px]">
        <p className="text-black font-bold text-[14px]">{owner}</p>
        <p className="text-[#475467] text-[14px] font-medium leading-4">
          {date ? formatDate(new Date(date)) : ""}
        </p>
      </div>
      <div className="flex items-start space-x-[10px] pb-[16px]">
        <div className="relative w-full">
          <div
            className={cn(
              (role === "Admin" || role === "manager") && "pr-10",
              "flex space-x-[10px]"
            )}
          >
            <span className="w-[12px] h-[12px] rounded-full bg-[#006A86] flex flex-shrink-0 mt-1"></span>
            <p className="text-[14px] leading-[21px] font-normal text-black">
              {description}
            </p>
          </div>
          {(role === "Admin" || role === "manager") && (
            <div className="absolute right-0 -top-1">
              <DeleteAnnouncemetDialog id={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementCop
