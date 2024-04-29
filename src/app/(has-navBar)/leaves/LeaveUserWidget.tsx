"use client"
import { LeaveIn, LeavePending } from "@/components/LeaveRequest"
import { RequestLeaveDialog } from "@/components/RequestLeaveDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Leave, User } from "@prisma/client"

import { findDaysBetweenDates, formatDate } from "@/utils/helpers"

interface LeaveUserWidgetProps {
  user: User
  leaves: Leave[]
  companyId: string
  leavesAll: Leave[]
}
const LeaveUserWidget = ({
  user,
  leaves,
  companyId,
  leavesAll
}: LeaveUserWidgetProps) => {
  const leavesPending = leaves.filter((l) => l.status === "Pending")
  const currentDate = formatDate(new Date())

  const leaveOngoing = leavesAll.filter(
    (l) =>
      l.status === "IsApproved" && formatDate(new Date(l.endDate)) > currentDate
  )

  return (
    <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <div className="flex items-center">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Leave
        </h1>
      </div>
      <div className="w-full grid grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-[24px] space-y-4">
          <p className=" font-ibm_plex_mono font-medium leading-6">
            Applied leave update
          </p>
          {leavesPending.length > 0 ? (
            <LeavePending leave={leavesPending} />
          ) : (
            <p>No pending leave you have</p>
          )}
        </div>
        <div className="p-4 bg-white rounded-[24px] space-y-4">
          <p className=" font-ibm_plex_mono font-medium leading-6">
            Who’s on leave in our department
          </p>

          {leaveOngoing.length > 0 ? (
            leaveOngoing.map((l) => (
              <div
                key={l.id}
                className="max-h-[100px] space-y-4 overflow-scroll"
              >
                <LeaveIn leave={l} />
              </div>
            ))
          ) : (
            <p>No Leaves yet</p>
          )}
        </div>
      </div>
      {/* <LeavePercentages /> */}

      <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Leave application summary
          </h2>
          <RequestLeaveDialog companyId={companyId} user={user} />
        </div>

        {leaves.length > 0 ? (
          <Table className="w-full">
            <TableHeader className="w-full">
              <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                <TableHead>Leave type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
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
                  <TableCell>{l.title}</TableCell>

                  <TableCell className="flex flex-nowrap">
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
            </TableBody>
          </Table>
        ) : (
          <p>No Leave yet</p>
        )}
      </div>
    </div>
  )
}

export default LeaveUserWidget
