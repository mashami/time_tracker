"use client"

import { AddingLeaveDaysDialog } from "@/components/AddingLeaveDaysDialog"
import { LeaveIn, LeaveRequest } from "@/components/LeaveRequest"
import { ArrowLeftSvg, ArrowRightSvg } from "@/components/Svg"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { changeLeave, getLeaves2 } from "@/services/user"
import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { IsLoadingType } from "@/utils/types"
import { Leave, Status } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface LeaveAdminWidgetProps {
  leaves: Leave[]
  companyId: string
  managersLeaves: Leave[]
  leaveDays: number | undefined
}

const LeaveAdminWidget = ({
  leaves: initialLeaves,
  companyId,
  managersLeaves,
  leaveDays
}: LeaveAdminWidgetProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [leaves, setLeaves] = useState<Leave[]>(initialLeaves)
  const [isLastPage, setIsLastPage] = useState<boolean>(false)
  const [isFirstPage, setIsFirstPage] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<IsLoadingType>({
    isLoadingIsProv: false,
    isLoadingIsRej: false
  })

  const currentDate = formatDate(new Date())
  const leaveOngoing = leaves.filter(
    (l) =>
      l.status === "IsApproved" && formatDate(new Date(l.endDate)) > currentDate
  )

  const leavesPending = managersLeaves.filter(
    (leave) => leave.status === "Pending"
  )

  const router = useRouter()

  const fetchLeaves = async (page: number) => {
    try {
      const response = await getLeaves2(companyId, page)
      const { data, pagination } = response

      setLeaves(data)
      setIsLastPage(pagination.isLastPage)
      setIsFirstPage(pagination.isFirstPage)

      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching leaves:", error)
    }
  }

  useEffect(() => {
    fetchLeaves(currentPage)
  }, [])

  const nextHandle = async () => {
    const nextPage = currentPage + 1
    fetchLeaves(nextPage)
    router.refresh()
  }

  const previousHandle = async () => {
    const previousPage = currentPage - 1
    fetchLeaves(previousPage)
    router.refresh()
  }

  const changeLeaveStatusHandler = async (
    leaveId: string,
    statusLL: Status
  ) => {
    if (!leaveId) {
      return toast({
        variant: "destructive",
        description: "leave ID is required"
      })
    }

    if (statusLL === Status.IsApproved) {
      setLoading({
        ...isLoading,
        isLoadingIsProv: true
      })
    } else {
      setLoading({
        ...isLoading,
        isLoadingIsRej: true
      })
    }

    try {
      const result = await changeLeave({
        leaveId,
        status: statusLL
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })

        if (statusLL === Status.IsApproved) {
          setLoading({
            ...isLoading,
            isLoadingIsProv: false
          })
        } else {
          setLoading({
            ...isLoading,
            isLoadingIsRej: false
          })
        }

        return
      }

      toast({
        description: result.message
      })

      router.refresh()

      if (statusLL === Status.IsApproved) {
        setLoading({
          ...isLoading,
          isLoadingIsProv: false
        })
      } else {
        setLoading({
          ...isLoading,
          isLoadingIsRej: false
        })
      }

      router.refresh()

      return
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server Error, please try again"
      })

      if (statusLL === Status.IsApproved) {
        setLoading({
          ...isLoading,
          isLoadingIsProv: false
        })
      } else {
        setLoading({
          ...isLoading,
          isLoadingIsRej: false
        })
      }

      return
    }
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
          <div className="p-4 bg-white rounded-[24px] space-y-4">
            <p className=" font-ibm_plex_mono font-medium leading-6">
              Who’s on leave in the company
            </p>

            {leaveOngoing.length > 0 ? (
              leaveOngoing.map((l) => (
                <div
                  key={l.id}
                  className="max-h-[100px] space-y-4 overflow-y-scroll p-[10px] bg-[#f9f9f9] rounded-2xl"
                >
                  <LeaveIn leave={l} />
                </div>
              ))
            ) : (
              <p>No Leaves yet</p>
            )}
          </div>
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Leave requests
            </h2>
            {leavesPending.length ? (
              leavesPending.map((l, i) => {
                return (
                  <div key={l.id} className="max-h-[426px] overflow-y-scroll">
                    <div className="p-[10px] space-y-6 h-full">
                      <LeaveRequest
                        id={l.id}
                        departmentName={l.departmentName}
                        description={l.description}
                        endDate={
                          l.updatedAt ? formatDate(new Date(l.updatedAt)) : ""
                        }
                        name={l.name}
                        startDate={
                          l.startDate ? formatDate(new Date(l.startDate)) : ""
                        }
                        onClick={changeLeaveStatusHandler}
                        isLoading={isLoading}
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
          <div className="flex items-center justify-between">
            <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
              Current leave application
            </h2>
            <p>{leaveDays} Leaves days in year</p>
            <AddingLeaveDaysDialog companyId={companyId} />
          </div>

          {leaves.length > 0 ? (
            <div className="py-0">
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
                <TableBody className="w-full">
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
                </TableBody>
              </Table>
              <div className="w-full border-[#EAECF0] border-[1px] flex items-center justify-between pt-[10px] pb-[13px] rounded-b-md px-5">
                <Button
                  className="flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[4px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer bg-white hover:bg-white/80"
                  text="Preview"
                  position="left"
                  svg={<ArrowLeftSvg />}
                  disabled={isFirstPage}
                  onClick={previousHandle}
                />
                <Button
                  className={cn(
                    "flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[4px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer bg-white hover:bg-white/80"
                  )}
                  text="Next"
                  svg={<ArrowRightSvg />}
                  disabled={isLastPage}
                  onClick={nextHandle}
                />
              </div>
            </div>
          ) : (
            <p>No Leave yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaveAdminWidget
