"use client"

import { Holiday } from "@/components/Holiday"

import { LeaveRequest } from "@/components/LeaveRequest"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getLeaves2 } from "@/services/user"
import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { Leave } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface LeaveAdminWidgetProps {
  leaves: Leave[]
  companyId: string
}

const LeaveAdminWidget = ({
  leaves: initialLeaves,
  companyId
}: LeaveAdminWidgetProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [leaves, setLeaves] = useState<Leave[]>(initialLeaves)
  const [leaveLength, setLeaveLength] = useState<number>(0)
  const [totalLeaves, setTotalLeaves] = useState<number>(0)

  const leavesPending = initialLeaves.filter(
    (leave) => leave.status === "Pending"
  )
  const router = useRouter()

  const fetchLeaves = async (page: number) => {
    try {
      const response = await getLeaves2(companyId, page)
      const { data, pagination } = response

      console.log(page)

      console.log(pagination)
      setTotalLeaves(pagination.totalCount)

      setLeaves(data)

      console.log(data.length)

      setLeaveLength((prevLength) => prevLength + data.length)

      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching leaves:", error)
    }
  }

  useEffect(() => {
    fetchLeaves(currentPage)
  }, [])

  // console.log("leaveLength ===>", leaveLength)
  // console.log("totalLeaves ===>", totalLeaves)

  const nextHandle = async () => {
    // if (leaveLength == totalLeaves) {
    //   return
    // }
    const nextPage = currentPage + 1
    fetchLeaves(nextPage)
    router.refresh()
  }

  const previousHandle = async () => {
    const previousPage = currentPage - 1
    fetchLeaves(previousPage)
    router.refresh()
  }

  return (
    <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <div className="flex items-center ">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Leave
        </h1>
      </div>
      <div className="space-y-6">
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Upcomming Holidays
            </h2>
            <div className="max-h-[426px] overflow-scroll">
              <div
                className="p-4 h-full"
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
          </div>
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Leave requests
            </h2>
            {leavesPending.length ? (
              leavesPending.map((l, i) => {
                return (
                  <div key={l.id} className="max-h-[426px] overflow-scroll">
                    <div className="p-[10px] space-y-6 h-full">
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
                  </div>
                )
              })
            ) : (
              <p className="font-bricolage font-semibold">
                No Leaves which is in pending mode
              </p>
            )}
          </div>
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-6">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Current leave application
          </h2>
          {leaves.length > 0 ? (
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow className="text-[#475467] text-[14px] leading-5">
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    Date
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    {" "}
                    User
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    Leave type
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    Form Date
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    To Date
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    Status
                  </TableHead>
                  <TableHead className="text-[#475467] text-[14px] leading-5">
                    Counts
                  </TableHead>
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
                      <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#006A86] text-white uppercase">
                        {l.name[0]}
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
                {/* {leaves.length > 0 && (
                  <TableRow className="w-full flex flex-shrink-0 items-center">
                    <TableCell
                      className="flex items-center flex-1"
                      onClick={previousHandle}
                    >
                      <span className="flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[6.5px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer">
                        <ArrowLeftSvg />
                        Preview
                      </span>
                    </TableCell>
                    <TableCell onClick={nextHandle}>
                      <span className="flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[6.5px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer">
                        Next
                        <ArrowRightSvg />
                      </span>
                    </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          ) : (
            <p>No Leave yet</p>
          )}
        </div>
        {/* <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
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
        </div> */}
      </div>
    </div>
  )
}

export default LeaveAdminWidget
