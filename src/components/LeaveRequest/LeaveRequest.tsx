import { IsLoadingType } from "@/app/(has-navBar)/leaves/LeaveAdminWidget"
import { Department, Status } from "@prisma/client"
import { Button } from "../ui/button"

/* eslint-disable react/no-unescaped-entities */
interface LeaveRequestProp {
  name: string
  description: string
  startDate: string
  endDate: string
  departiment: Department
  id: string
  onClick: (id: string, status: Status) => void
  isLoading: IsLoadingType
}

//
const LeaveRequest = ({
  name,
  description,
  startDate,
  endDate,
  departiment,
  onClick,
  id,
  isLoading
}: LeaveRequestProp) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#006A86]">
            <p className="text-[22.397px] font-medium leading-[31px] text-white">
              {name[0].toUpperCase()}
            </p>
          </div>
          <div className="space-y-[2px]">
            <p className="font-semibold text-[14px] leading-4 text-black">
              {name}
            </p>
            <span className="flex text-[10px] leading-4 font-medium">
              <p>From:{startDate}</p>-<p>To:{endDate}</p>
            </span>
          </div>
        </div>
        <p className="text-[12px] font-medium leading-4">
          {departiment === "designer" ? "UI/UX Design" : ""}
          {departiment === "dev" ? "Developer " : ""}
          {departiment === "manager" ? "Manager " : ""}
        </p>
      </div>
      <div className="flex space-x-2">
        <h3 className="text-[14px] font-medium leading-4">Reason:</h3>
        <p className="text-[12px] leading-4 font-normal text-black">
          {description}
        </p>
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
            className="text-black w-full px-7"
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
