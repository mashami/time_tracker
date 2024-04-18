"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { requestLeave } from "@/services/user"
import { Leave } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardUserWidgetPageProps {
  userId: string
  companyId: string
  leaves: Leave[]
}

const DashboardUserWidgetPage = ({
  userId,
  companyId,
  leaves
}: DashboardUserWidgetPageProps) => {
  const [title, setTitle] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [destription, setDestription] = useState<string>("")

  const router = useRouter()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.stopPropagation()

    if (!title || !startDate || !endDate || !destription) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    try {
      const result = await requestLeave({
        userId,
        companyId,
        title,
        startDate,
        endDate,
        description: destription
      })

      console.log(result)

      if (result.error) {
        return toast({
          variant: "destructive",
          description: result.message
        })
      }

      console.log(result.OK)

      if (result.OK) {
        router.refresh()
        return toast({
          description: result.message
        })
      }
      router.refresh()

      return toast({
        description: result.message
      })
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })
    }
  }

  function formatDate(date: Date) {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date. Argument must be of type Date.")
    }
    const formattedDate = date.toISOString().split("T")[0]
    return formattedDate
  }

  return (
    <div className="">
      <div>
        <h1>Welcome on The dashboard for User</h1>
        <h1>Request</h1>
        <form
          action=""
          onSubmit={onSubmitHandler}
          className="flex flex-col space-y-4 space-x-4 w-[300px]"
        >
          <label htmlFor="">Title</label>

          <input
            type="text"
            placeholder="Enter a title"
            className="border border-[#726b6b] p-2 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="">Start Date</label>

          <input
            type="date"
            placeholder=""
            className="border border-[#726b6b] p-2 rounded-md"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <label htmlFor="">End Date</label>

          <input
            type="date"
            placeholder=""
            className="border border-[#726b6b] p-2 rounded-md"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
          <label htmlFor="">Description</label>

          <textarea
            className="border border-[#726b6b]"
            value={destription}
            onChange={(e) => setDestription(e.target.value)}
          />
          <Button>Request leave</Button>
        </form>
      </div>
      <div className="py-12">
        <h1 className="font-ibm_plex_mono text-[20px] font-bold pb-6">
          Leave requestes
        </h1>
        {leaves.length > 0 ? (
          <table>
            <thead className="">
              <tr className=" space-x-9">
                <th>date</th>
                <th>Title</th>

                <th>Request date</th>
                <th>End date</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className=" space-x-9">
                  <td className="pl-8">
                    {leave.createdAt
                      ? formatDate(new Date(leave.createdAt))
                      : ""}
                  </td>
                  <td className="pl-8">{leave.title}</td>
                  <td className="pl-8">
                    {leave.startDate
                      ? formatDate(new Date(leave.startDate))
                      : ""}
                  </td>
                  <td className="pl-8">
                    {leave.endDate ? formatDate(new Date(leave.endDate)) : ""}
                  </td>
                  <td className="pl-8">{leave.description}</td>
                  <td
                    className={cn(
                      "pl-8",
                      leave.status === "Pending" && "text-purple-500",
                      leave.status === "IsApproved" && "text-blue-500",
                      leave.status === "Rejected" && "text-red-500"
                    )}
                  >
                    {leave.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Leaves yet request</p>
        )}
      </div>
    </div>
  )
}

export default DashboardUserWidgetPage
