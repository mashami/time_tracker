import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { Leave } from "@prisma/client"

interface LeavePendingProps {
  leave: Leave[]
}

const LeavePending = ({ leave }: LeavePendingProps) => {
  return (
    <div className="p-[24px] bg-white rounded-[16px] border-[0.5px] border-[#CDDFE9] flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <span className="flex flex-col flex-shrink-0 items-center space-y-1">
          <span className="w-4 h-4 rounded-full flex  bg-[#006A86] "></span>
          <span className="w-[0.5px] h-5 bg-[#006A86]"></span>
        </span>

        <div className="font-medium leading-4 text-[12px] space-y-1 ">
          <p className="">
            From:{" "}
            {leave[0].startDate ? formatDate(new Date(leave[0].startDate)) : ""}{" "}
            To: {leave[0].endDate ? formatDate(new Date(leave[0].endDate)) : ""}
          </p>
          <div className="flex items-center justify-between">
            <p>{leave[0].title}</p>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-[#006A86]"></span>
              <p className="text-[12px]">
                {" "}
                {findDaysBetweenDates(
                  leave[0].startDate
                    ? formatDate(new Date(leave[0].startDate))
                    : "",
                  leave[0].endDate ? formatDate(new Date(leave[0].endDate)) : ""
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="flex items-center w-fit space-x-1 pl-[8px] pr-[10px] py-1 bg-[#F2F4F7] text-black rounded-[16px]">
          <p className="text-[12px] font-medium leading-[18px] text-[#344054]">
            Pending ...
          </p>
        </span>
      </div>
    </div>
  )
}

export default LeavePending
