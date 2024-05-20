"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Announcement } from "@prisma/client"
import { NotificationSvg } from "../Svg"
import Notification from "./Notification"

interface NotificationDropdownProp {
  annoucements: Announcement[]
}

const NotificationDropdown = ({ annoucements }: NotificationDropdownProp) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0 ring-offset-0 border-none">
          <div className="w-10 h-10 bg-[#F9F9FA] rounded-full flex items-center justify-center">
            <NotificationSvg />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className="w-[500px] bg-white rounded-[10px] p-6 space-y-4 mr-4 border border-[#CDDFE9]"
        >
          <div className="flex items-center justify-between">
            <p className="font-ibm_plex_mono font-medium leading-6">
              All notification ({annoucements.length} new)
            </p>
            <p className="font-medium leading-6 text-[#006A86]">
              Mark all as read{" "}
            </p>
          </div>
          {annoucements.map((a) => (
            <DropdownMenuItem key={a.id}>
              <Notification
                createAt={a.createdAt}
                description={a.description}
                owner={a.owner}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default NotificationDropdown
