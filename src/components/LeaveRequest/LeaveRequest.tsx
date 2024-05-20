import { formatDate } from "@/utils/helpers"
import { IsLoadingType } from "@/utils/types"
import { Status } from "@prisma/client"
import { Button } from "../ui/button"

/* eslint-disable react/no-unescaped-entities */
interface LeaveRequestProp {
  name: string
  description: string
  startDate: string
  endDate: string
  departmentName: string
  id: string
  isLoading: IsLoadingType

  onClick: (leaveId: string, statusLL: Status) => void
}

//
const LeaveRequest = ({
  name,
  description,
  startDate,
  endDate,
  id,
  departmentName,
  onClick,
  isLoading
}: LeaveRequestProp) => {
  return (
    <div className="space-y-4 p-[10px] bg-[#F9F9F9] rounded-2xl">
      <div className="flex justify-between w-full">
        <div className="w-full flex items-center justify-between ">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#006A86]">
              <p className="text-[22.397px] font-medium leading-[31px] text-white">
                {name[0].toUpperCase()}
              </p>
            </div>

            <div className="space-y-[2px]">
              <p className="font-semibold text-[14px] leading-4 text-black">
                {name}
              </p>
              <span className="flex text-[12px] leading-4 font-medium">
                <p>From: {startDate ? formatDate(new Date(startDate)) : ""}</p>-
                <p>To: {endDate ? formatDate(new Date(endDate)) : ""}</p>
              </span>
            </div>
          </div>

          <div className="py-2 px-[7px] bg-[#ECECEC] rounded-md">
            <p className="text-[12px] font-medium leading-4">
              {departmentName} department
            </p>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 text-[13px]">
        <h3 className="font-bold leading-4">Reason:</h3>
        <p className="leading-4 font-normal text-black">{description}</p>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex items-center w-full space-x-4">
          <Button
            className="text-white w-full"
            text="Approve"
            style={{
              boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
            }}
            onClick={() => onClick(id, "IsApproved")}
            loading={isLoading.isLoadingIsProv}
            disabled={isLoading.isLoadingIsProv}
          />

          <Button
            variant={"secondary"}
            className="text-black w-full px-7 bg-white"
            text="Reject"
            onClick={() => onClick(id, "Rejected")}
            loading={isLoading.isLoadingIsRej}
            disabled={isLoading.isLoadingIsRej}
          />
        </div>
      </div>
    </div>
  )
}

export default LeaveRequest
