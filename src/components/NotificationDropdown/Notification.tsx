"use client"

import { daysAgo } from "@/utils/helpers"
import Link from "next/link"

interface NotificationProps {
  owner: string
  description: string
  createAt: Date
}

const Notification = ({ owner, description, createAt }: NotificationProps) => {
  const daysgo = daysAgo(createAt)

  return (
    <Link
      href={"/announcements"}
      className="flex justify-between space-x-4 bg-[#F9F9F9] p-4 rounded-[16px]"
    >
      <div className="flex space-x-[14px]">
        <div className="w-8 h-8 rounded-full bg-[#006A86] flex items-center justify-center text-[22.397px] leading-[31px] font-medium text-white">
          {owner ? owner[0] : ""}
        </div>
        <div className="flex flex-1">
          <div className="space-y-px">
            <div className="flex items-center justify-between flex-shrink-0 text-[14px] leading-5 font-medium">
              <p className="text-black flex flex-1 flex-shrink-0">{owner}</p>
              <p className="text-[#5F6368]">Attention</p>
            </div>
            <div className="flex flex-wrap items-end">
              <p className="text-[14px] leading-5 font-medium text-[#5F6368] line-clamp-3">
                {description}
              </p>
              <p className="text-[#006A86]">More</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[14px] leading-[21px] text-black font-medium flex flex-shrink-0">
        {daysgo} days ago
      </p>
    </Link>
  )
}

export default Notification
