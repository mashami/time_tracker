import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { Leave } from "@prisma/client"

interface LeaveInProps {
  leave: Leave
}

const LeaveIn = ({ leave }: LeaveInProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-[#006A86] flex items-center justify-center flex-shrink-0 text-[22.397px] font-medium leading-[32px] text-white">
        {leave.name[0].toUpperCase()}
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-medium leading-4 text-[14px] text-black">
            {leave.name}
          </p>
          <p className="font-medium leading-4 text-[14px] text-black">
            {leave.departiment}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium leading-4 text-[12px] text-black">
            {leave.startDate ? formatDate(new Date(leave.startDate)) : ""}
          </p>
          <span className="flex items-center space-x-1">
            <span className="w-1 h-1 rounded-full bg-[#006A86]"></span>
            <p className="text-[12px] font-medium leading-4">
              {findDaysBetweenDates(
                leave.startDate ? formatDate(new Date(leave.startDate)) : "",
                leave.endDate ? formatDate(new Date(leave.endDate)) : ""
              )}
            </p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LeaveIn
