"use client"
import { LeaveIn, LeaveRequest } from "@/components/LeaveRequest"
import { RequestLeaveDialog } from "@/components/RequestLeaveDialog"
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
import { cn } from "@/lib/utils"

import { toast } from "@/components/ui/use-toast"
import { pusherClient } from "@/lib/pusher"
import { changeLeave } from "@/services/user"
import { findDaysBetweenDates, formatDate } from "@/utils/helpers"
import { IsLoadingType } from "@/utils/types"
import { Leave, Status } from "@prisma/client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface LeaveManagerWidgetProps {
  leaves: Leave[]
  id: string
  departmentId: string
  remaingDays: number
}
const LeaveManagerWidget = ({
  leaves,
  id,
  departmentId,
  remaingDays
}: LeaveManagerWidgetProps) => {
  const [isLoading, setLoading] = useState<IsLoadingType>({
    isLoadingIsProv: false,
    isLoadingIsRej: false
  })

  const [oncomingLeave, setOncomingLeave] = useState<Leave[]>([])

  useEffect(() => {
    const handleIncomingLeave = (leave: Leave) => {
      setOncomingLeave((prev) => [...prev, leave])
    }

    pusherClient.subscribe(departmentId || "")
    pusherClient.bind("incoming-leave", handleIncomingLeave)

    return () => {
      pusherClient.unbind("incoming-leave", handleIncomingLeave)
      pusherClient.unsubscribe(departmentId || "")
    }
  }, [departmentId])

  const router = useRouter()

  const myLeaves = leaves.filter((l) => l.userId === id)

  const leavesPending = leaves.filter(
    (l) => l.status === "Pending" && l.userId !== id
  )

  const currentDate = formatDate(new Date())

  const leaveOngoing = leaves.filter(
    (l) =>
      l.status === "IsApproved" && formatDate(new Date(l.endDate)) > currentDate
  )

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
    <motion.section
      initial={{ y: "-10%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8"
    >
      <div className="flex items-center">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Leave
        </h1>
      </div>
      <div className="w-full grid grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-[24px] space-y-4">
          <p className=" font-ibm_plex_mono font-medium leading-6">
            Who’s on leave in our department
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
                      isLoading={isLoading}
                      onClick={changeLeaveStatusHandler}
                      departmentName={l.departmentName}
                      id={l.id}
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

          {oncomingLeave.map((l, i) => (
            <div key={l.id} className="max-h-[426px] overflow-y-scroll">
              <div className="p-[10px] space-y-6 h-full">
                <LeaveRequest
                  isLoading={isLoading}
                  onClick={changeLeaveStatusHandler}
                  departmentName={l.departmentName}
                  id={l.id}
                  description={l.description}
                  endDate={l.updatedAt ? formatDate(new Date(l.updatedAt)) : ""}
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
          ))}
        </div>
      </div>

      <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            My Leaves
          </h2>
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Remaining days ({remaingDays} days)
          </h2>
          <RequestLeaveDialog departmentId={departmentId} />
        </div>

        {myLeaves.length > 0 ? (
          <div>
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
                {myLeaves.map((l) => (
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
                      )}{" "}
                      Days
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
                disabled={true}
                // onClick={previousHandle}
              />
              <Button
                className={cn(
                  "flex items-center gap-[6.5px] border-[0.823px] border-[#EAECF0] rounded-[6.5px] px-[11.5px] py-[4px] text-[11.4px] text-[#344054] font-semibold leading-[16.462px] cursor-pointer bg-white hover:bg-white/80"
                )}
                text="Next"
                svg={<ArrowRightSvg />}
                // disabled={isLastPage}
                // onClick={nextHandle}
              />
            </div>
          </div>
        ) : (
          <p>No Leave yet</p>
        )}
      </div>
    </motion.section>
  )
}

export default LeaveManagerWidget
