/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { changeLeave, deleteUser, inviteUser } from "@/services/user"
import { getLeavesByUserTypes } from "@/utils/types"
import { Invitations, Leave, Status, User } from "@prisma/client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardAdminPageWidgetProp {
  companyId: string
  leaves: Leave[]
  users: User[]
  invitations: Invitations[]
}

const DashboardAdminPageWidget = ({
  companyId,
  leaves,
  users,
  invitations
}: DashboardAdminPageWidgetProp) => {
  const [email, setEmail] = useState<string>("")
  const [department, setDepartment] = useState<string>("dev")

  const router = useRouter()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.stopPropagation()

    if (!email) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    try {
      const result = await inviteUser({
        companyId,
        department,
        email
      })

      if (result.error) {
        return toast({
          variant: "destructive",
          description: result.message
        })
      }
      router.refresh()

      return toast({
        variant: "default",
        description: "User invited successfully"
      })
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })
    }
  }

  const resendInvitation = async (
    companyId: string,
    department: string,
    email: string,
    id: string
  ) => {
    if (!companyId || !department || !email) {
      return toast({
        variant: "destructive",
        description: "companyId, department and email as well required"
      })
    }
    try {
      const result = await inviteUser({
        companyId,
        department,
        email,
        invitationId: id
      })

      if (result.error) {
        return toast({
          variant: "destructive",
          description: result.error
        })
      }
      router.refresh()

      return toast({
        variant: "default",
        description: result.message
      })
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })
    }
  }

  const onClickHandler = async (leaveId: string, statusLL: Status) => {
    if (!leaveId) {
      return toast({
        variant: "destructive",
        description: "leave ID is required"
      })
    }
    try {
      const result = await changeLeave({
        leaveId,
        status: statusLL
      })

      if (result.error) {
        return toast({
          variant: "destructive",
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
        description: "Server Error, please try again"
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

  const deleteUserHandler = async ({
    userId,
    companyId
  }: getLeavesByUserTypes) => {
    if (!userId || !companyId) {
      return toast({
        variant: "destructive",
        description: "Ids are required"
      })
    }
    try {
      const result = await deleteUser({ userId, companyId })

      if (result.error) {
        return toast({
          variant: "destructive",
          description: result.message
        })
      }

      router.refresh()

      return toast({
        description: "Staff has deleted sucessfully"
      })
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Server error, Please Try again buddy!"
      })
    }
  }

  return (
    <div className="space-y-8 gap-5 w-full">
      <div>
        <h1 className="font-ibm_plex_mono text-[20px] font-bold pb-8">
          dashboard for the Admin
        </h1>
        <h2 className="font-ibm_plex_mono text-[16px] font-bold pb-8">
          Create a user
        </h2>
        <form
          action=""
          onSubmit={onSubmitHandler}
          className="flex  items-center space-x-4"
        >
          <label htmlFor="">Email</label>

          <input
            type="email"
            placeholder="Type Email ..."
            className="border border-[#726b6b] p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="">Role</label>

          <input
            type="text"
            placeholder="Type Email ..."
            className="border border-[#726b6b] p-2 rounded-md"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Button>Create a users</Button>
        </form>
      </div>
      <div>
        <h1 className="font-ibm_plex_mono text-[20px] font-bold pb-6">
          Leave requestes
        </h1>
        {leaves.length > 0 ? (
          <table>
            <thead className="">
              <tr className=" space-x-9">
                <th>date</th>
                <th>Email</th>

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
                  <td className="pl-8">{leave.email}</td>
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

                  <td>
                    <button
                      className="text-blue-500 pl-4"
                      onClick={() => onClickHandler(leave.id, "IsApproved")}
                    >
                      Approved
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-red-500 pl-4"
                      onClick={() => onClickHandler(leave.id, "Rejected")}
                    >
                      Rejected
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Leaves yet in this company</p>
        )}
      </div>

      <div>
        <h1 className="font-ibm_plex_mono text-[20px] font-bold pb-6">
          All users
        </h1>
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="pl-8">Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="">
                    {user.createdAt ? formatDate(new Date(user.createdAt)) : ""}
                  </td>
                  <td className="pl-8">{user.name}</td>
                  <td className="pl-8">{user.email}</td>
                  <td className="pl-8">{user.role}</td>
                  {user.role !== "Admin" && (
                    <td
                      className={"text-red-500"}
                      onClick={() =>
                        deleteUserHandler({
                          userId: user.id,
                          companyId: user.companyId
                        })
                      }
                    >
                      <button>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaves in this company</p>
        )}
      </div>

      <div className="pb-24">
        <h1 className="font-ibm_plex_mono text-[20px] font-bold py-6">
          All Invitations users
        </h1>
        {invitations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="pl-8">Date</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((u) => (
                <tr key={u.id}>
                  <td className="">
                    {u.createdAt ? formatDate(new Date(u.createdAt)) : ""}
                  </td>
                  <td className="pl-8">{u.email}</td>
                  <td className="pl-8">{u.department}</td>
                  <td
                    className={cn(
                      "pl-8",
                      u.isActive ? "text-red-500" : "text-purple-500"
                    )}
                  >
                    {u.isActive === true ? "UnActive" : "Active"}
                  </td>
                  {u.isActive === true && (
                    <td>
                      <button
                        className="pl-12 text-blue-600"
                        onClick={() =>
                          resendInvitation(
                            u.companyId,
                            u.department,
                            u.email,
                            u.id
                          )
                        }
                      >
                        Resend invitation
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Invitions yet in this company</p>
        )}
      </div>
    </div>
  )
}

export default DashboardAdminPageWidget
