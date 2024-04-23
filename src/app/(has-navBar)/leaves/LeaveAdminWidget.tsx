"use client"

import { Holiday } from "@/components/Holiday"

import { LeaveRequest } from "@/components/LeaveRequest"

import { Search } from "@/components/Search"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Leave, User } from "@prisma/client"

interface LeaveAdminWidgetProps {
  user: User
  leaves: Leave[]
}
export const findDaysBetweenDates = (
  startDateStr: string,
  endDateStr: string
) => {
  // Parse start and end date strings into Date objects
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  // Check if the parsed dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error(
      "Invalid date format. Please provide dates in the format 'YYYY-MM-DD'."
    )
  }

  // Convert dates to UTC to ensure consistent calculations
  const startUTC = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  )
  const endUTC = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  )

  // Calculate the difference in milliseconds
  const diffMillis = Math.abs(endUTC - startUTC)

  // Convert milliseconds to days
  const days = Math.floor(diffMillis / (1000 * 60 * 60 * 24))

  return days + `${days > 1 ? "Days" : "Day"}`
}
const LeaveAdminWidget = ({ user, leaves }: LeaveAdminWidgetProps) => {
  const leavesPending = leaves.filter((leave) => leave.status === "Pending")

  console.log(leavesPending.length)

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date. Argument must be of type Date.")
    }
    const formattedDate = date.toISOString().split("T")[0]
    return formattedDate
  }

  return (
    <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Dashboard
        </h1>
        <Search />
      </div>
      <div className="space-y-6">
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Upcomming Holidays
            </h2>
            <div
              className="p-4 max-h-[426px] overflow-scroll"
              style={{
                borderRadius: "16px",
                border: "0.5px solid #CDDFE9"
              }}
            >
              <Holiday />
              <Holiday />
              <Holiday />
              <Holiday />
            </div>
          </div>
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Leave requests
            </h2>
            {leavesPending.length ? (
              leavesPending.map((l, i) => {
                return (
                  <div
                    key={l.id}
                    className="p-[10px] space-y-6 max-h-[426px] overflow-scroll"
                  >
                    <LeaveRequest
                      id={l.id}
                      departiment={l.departiment}
                      description={l.description}
                      endDate={
                        l.updatedAt ? formatDate(new Date(l.updatedAt)) : ""
                      }
                      name={l.name}
                      startDate={
                        l.startDate ? formatDate(new Date(l.startDate)) : ""
                      }
                    />
                    {i !== leavesPending.length - 1 && (
                      <div className="w-full h-[0.5px] border-[0.5px] border-[#CDDFE9]"></div>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="font-bricolage font-semibold">
                No Leaves which is in pending mode{" "}
              </p>
            )}
          </div>
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Current leave application
          </h2>
          {leaves.length > 0 ? (
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                  <TableHead>Date</TableHead>
                  <TableHead className=""> User</TableHead>
                  <TableHead>Leave type</TableHead>
                  <TableHead>Form Date</TableHead>
                  <TableHead>To Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Counts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full group">
                {leaves.map((l) => (
                  <TableRow
                    key={l.id}
                    className=" text-[#475467] text-[14px] font-normal leading-5"
                  >
                    <TableCell className="">
                      {l.updatedAt ? formatDate(new Date(l.updatedAt)) : ""}
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#006A86] text-white">
                        {l.name[0].toUpperCase()}
                      </span>
                      <p> {l.name}</p>
                    </TableCell>

                    <TableCell>{l.title}</TableCell>
                    <TableCell>
                      {l.startDate ? formatDate(new Date(l.startDate)) : ""}
                    </TableCell>
                    <TableCell>
                      {l.endDate ? formatDate(new Date(l.endDate)) : ""}
                    </TableCell>
                    <TableCell className="">
                      {l.status === "IsApproved" && (
                        <span className="flex items-center w-fit space-x-1 px-[12px] py-1 bg-[#ECFDF3] text-[#027A48] rounded-[16px]">
                          <p>Approved</p>
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="#12B76A"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                      {l.status === "Pending" && (
                        <span className="flex items-center w-fit space-x-1 px-[12px] py-1 bg-[#F2F4F7] text-black rounded-[16px]">
                          <p>Pending ...</p>
                        </span>
                      )}
                      {l.status === "Rejected" && (
                        <span className=" flex items-center w-fit space-x-1 px-[12px] py-1 bg-[#FEF3F2] text-[#B42318] rounded-[16px]">
                          <p>Declined</p>
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.5 3.5L3.5 8.5M3.5 3.5L8.5 8.5"
                              stroke="#F04438"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {findDaysBetweenDates(
                        l.startDate ? formatDate(new Date(l.startDate)) : "",
                        l.endDate ? formatDate(new Date(l.endDate)) : ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {/* <TableRow className="px-5 pt-[10px] pb-[13.17px] flex items-center space-x-4 justify-between">
              <div
                className="cursor-pointer py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
                style={{
                  borderRadius: "6.585px",
                  border: " 0.823px solid #EAECF0",
                  background: "var(--Base-White, #FFF)"
                }}
              >
                <ArrowLeftSvg />
                <p className="text-[#344054] text-[11.5px] font-semibold leading-[16px]">
                  Previous
                </p>
              </div>
              <div
                className="cursor-pointer py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
                style={{
                  borderRadius: "6.585px",
                  border: " 0.823px solid #EAECF0",
                  background: "var(--Base-White, #FFF)"
                }}
              >
                <p className="text-[#344054] text-[11.5px] font-semibold leading-[16px]">
                  Next
                </p>
                <ArrowRightSvg />
              </div>
            </TableRow> */}
              </TableBody>
            </Table>
          ) : (
            <p>No Leave yet</p>
          )}
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Percentage leaves in year
          </h2>
          <div className="flex items-center justify-between w-full space-x-6">
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex flex-col items-start justify-center  p-4">
              <p className="text-[14px] font-normal text-black">Annual leave</p>
              <h1 className="text-[24px] font-medium text-black">26%</h1>
            </div>
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex flex-col items-start justify-center  p-4">
              <p className="text-[14px] font-normal text-black">
                Personal leave
              </p>
              <h1 className="text-[24px] font-medium text-black">56%</h1>
            </div>
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex flex-col items-start justify-center  p-4">
              <p className="text-[14px] font-normal text-black">
                Long service leave
              </p>
              <h1 className="text-[24px] font-medium text-black">21%</h1>
            </div>
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex flex-col items-start justify-center  p-4">
              <p className="text-[14px] font-normal text-black">
                Emergency leave
              </p>
              <h1 className="text-[24px] font-medium text-black">32%</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveAdminWidget
