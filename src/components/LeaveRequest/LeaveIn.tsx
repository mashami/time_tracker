import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { Leave } from "@prisma/client"

interface LeaveInProps {
  leave: Leave
}

const LeaveIn = ({ leave }: LeaveInProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded-full bg-[#006A86] flex items-center justify-center flex-shrink-0 text-[18px] font-medium leading-[32px] text-white">
          {leave.name[0].toUpperCase()}
        </div>
        <p className="font-medium leading-4 text-[14px] text-black">
          {leave.name}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <p className="font-medium leading-4 text-[12px] text-black">
          {leave.startDate ? formatDate(new Date(leave.startDate)) : ""}
        </p>
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006A86]"></span>
          <p className="text-[12px] font-medium leading-4">
            {findDaysBetweenDates(
              leave.startDate ? formatDate(new Date(leave.startDate)) : "",
              leave.endDate ? formatDate(new Date(leave.endDate)) : ""
            )}{" "}
            Days
          </p>
        </span>
      </div>
    </div>
  )
}

export default LeaveIn
