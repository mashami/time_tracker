"use client"

import { Holiday } from "@/components/Holiday"
import { LeavePercentages } from "@/components/LeaveRequest"
import { Search } from "@/components/Search"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Announcement, Leave, User } from "@prisma/client"
import { findDaysBetweenDates } from "../leaves/LeaveAdminWidget"
interface DashboardUserWidgetPageProps {
  userId: string
  companyId: string
  leaves: Leave[]
  user: User
  announcements: Announcement[]
}

const DashboardUserWidgetPage = ({
  userId,
  companyId,
  leaves,
  user,
  announcements
}: DashboardUserWidgetPageProps) => {
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date. Argument must be of type Date.")
    }
    const formattedDate = date.toISOString().split("T")[0]
    return formattedDate
  }

  const newAnnLength = () => {
    if (announcements.length > 0) {
      const currentDate = formatDate(new Date())

      const newAnn = announcements.filter((ann) =>
        ann.createdAt ? formatDate(new Date(ann.createdAt)) : "" === currentDate
      )

      return newAnn.length
    }

    return 0
  }

  return (
    <section className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Dashboard
        </h1>
        <Search />
      </div>
      <LeavePercentages />

      <div className="w-full p-4 rounded-[24px] bg-white space-y-6">
        <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
          Leave application summary
        </h2>
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
            <TableBody className="w-full">
              {leaves.map((l) => (
                <TableRow
                  key={l.id}
                  className=" text-[#475467] text-[14px] font-normal leading-5"
                >
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
      <div className="w-full grid grid-cols-2 gap-6">
        <div>
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
              <Holiday />
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <div className="flex items-center space-x-3 w-full">
              <h2 className="font-medium leading-6 text-[16px] text-black font-ibm_plex_mono">
                Announcements
              </h2>
              <p className="text-[#006A86] font-ibm_plex_mono font-medium leading-6">
                {`(${newAnnLength().toString()} new)`}
              </p>
            </div>
            <div className="space-y-6">
              {announcements.length - 1 > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="space-y-[10px] px-[10px] pt-[6px] border border-[#CDDFE9] rounded-[10px]"
                  >
                    <div className="flex items-center justify-between pb-[4px]">
                      <p className="text-black font-bold text-[14px]">
                        {ann.owner}
                      </p>
                      <p className="text-[#475467] text-[14px] font-medium leading-4">
                        {ann.updatedAt
                          ? formatDate(new Date(ann.updatedAt))
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-[10px] pb-[16px]">
                      <span className="w-[12px] h-[12px] rounded-full bg-[#0BA42D] flex flex-shrink-0"></span>
                      <p className="text-[14px] leading-[21px] font-normal text-black">
                        {ann.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-medium font-bricolage text-center">
                  No Announcements yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardUserWidgetPage
