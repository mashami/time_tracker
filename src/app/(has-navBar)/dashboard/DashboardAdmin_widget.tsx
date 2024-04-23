/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Search } from "@/components/Search"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { deleteUser, inviteUser } from "@/services/user"
import { Announcement, Department, Invitations, User } from "@prisma/client"

import { AnnouncementDialog } from "@/components/AnnouncementDialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardAdminPageWidgetProp {
  companyId: string

  users: User[]
  invitations: Invitations[]
  announcements: Announcement[]
}

export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date. Argument must be of type Date.")
  }
  const formattedDate = date.toISOString().split("T")[0]
  return formattedDate
}

const DashboardAdminPageWidget = ({
  companyId,

  users,
  invitations,
  announcements
}: DashboardAdminPageWidgetProp) => {
  const [email, setEmail] = useState<string>("")
  const [department, setDepartment] = useState<Department>("dev")

  const router = useRouter()

  // console.log("invitation ===>", invitations)
  // console.log("users ===>", users)

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const onSubmitInviteFormHandler = async () => {
    if (!isEmailValid(email)) {
      return toast({
        variant: "destructive",
        description: "Provide Valid email"
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
      setEmail("")
      setDepartment(Department.dev)
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

  const deleteUserHandler = async (userId: string) => {
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
              Send an Invite
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Add email her"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  onValueChange={(value: Department) => setDepartment(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Department.designer}>
                      UI/UX Department
                    </SelectItem>
                    <SelectItem value={Department.dev}>
                      DEV Department
                    </SelectItem>
                    <SelectItem value={Department.manager}>
                      Marketin Department
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center w-full space-x-2">
                <Button
                  className="text-white w-full"
                  text="Send Invite"
                  style={{
                    boxShadow:
                      " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                  }}
                  onClick={onSubmitInviteFormHandler}
                />
                <Button
                  variant={"secondary"}
                  className="text-black w-full"
                  text="Cancel"
                  onClick={() => {
                    setDepartment(Department.dev), setEmail("")
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-white p-4 rounded-[24px]">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-medium leading-6 text-[16px] text-black font-ibm_plex_mono">
                Announcements
              </h2>

              <AnnouncementDialog companyId={companyId} />
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
                <p className="font-medium font-bricolage">
                  No Announcements yet
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Activities tracking
          </h2>
          <div className="grid grid-cols-3 gap-6 w-full">
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex items-center space-x-[10px] p-4">
              <h1 className="text-[48px] leading-6 font-medium text-black">
                126
              </h1>
              <span className="flex flex-col space-y-2">
                <p className="text-[16px] font-medium leading-6">Total</p>
                <p className="text-[16px] font-medium leading-6">Employees</p>
              </span>
            </div>
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex items-center space-x-[10px] p-4">
              <h1 className="text-[48px] leading-6 font-medium text-black">
                126
              </h1>
              <span className="flex flex-col space-y-2">
                <p className="text-[16px] font-medium leading-6">
                  All Approved
                </p>
                <p className="text-[16px] font-medium leading-6">Leave</p>
              </span>
            </div>
            <div className="h-[163px] w-full rounded-[16px] border-[0.5px] border-[#CDDFE9] flex items-center space-x-[10px] p-4">
              <h1 className="text-[48px] leading-6 font-medium text-black">
                126
              </h1>
              <span className="flex flex-col space-y-2">
                <p className="text-[16px] font-medium leading-6">
                  All Declined
                </p>
                <p className="text-[16px] font-medium leading-6">Leave</p>
              </span>
            </div>
          </div>
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Workers management
          </h2>
          {users.length > 0 ? (
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                  <TableHead className=""> Workers name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>

                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full group">
                {users.map((i) => (
                  <TableRow
                    key={i.id}
                    className="text-[#475467] text-[14px] font-normal leading-5"
                  >
                    <TableCell>
                      <span className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full flex justify-center items-center bg-[#006A86] text-white">
                          {i.name ? i.name[0].toUpperCase() : "-"}
                        </span>
                        <p>{i.name}</p>
                      </span>
                    </TableCell>
                    <TableCell>
                      {i.createdAt ? formatDate(new Date(i.createdAt)) : ""}
                    </TableCell>
                    <TableCell>{i.role} </TableCell>
                    <TableCell>{i.department}</TableCell>

                    <TableCell>
                      {i.role === "Staff" ? (
                        <button
                          className="text-[#B42318] px-[12px] py-[6px] border border-[#FEF3F2] bg-[#fff] rounded-[7px]"
                          onClick={() => deleteUserHandler(i.id)}
                        >
                          Delete
                        </button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {/* <TableRow className="px-5 pt-[10px] pb-[13.17px] flex items-center justify-between">
              <button
                className="py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
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
              </button>
              <button
                className="py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
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
              </button>
            </TableRow> */}
              </TableBody>
            </Table>
          ) : (
            <p>No Users yet</p>
          )}
        </div>
        <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
          <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
            Invitations management
          </h2>
          {invitations.length > 0 ? (
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full group">
                {invitations.map((i) => (
                  <TableRow
                    key={i.id}
                    className="text-[#475467] text-[14px] font-normal leading-5"
                  >
                    <TableCell>
                      {i.createdAt ? formatDate(new Date(i.createdAt)) : ""}
                    </TableCell>

                    <TableCell>{i.email} </TableCell>

                    <TableCell>Staff </TableCell>

                    <TableCell>{i.department}</TableCell>

                    <TableCell>
                      {!i.isActive ? (
                        <span className="px-[12px] py-1 bg-[#ECFDF3] text-[#027A48] rounded-[16px]">
                          Active
                        </span>
                      ) : (
                        <span className="px-[12px] py-1 bg-[#FEF3F2] text-[#B42318] rounded-[16px]">
                          Not active
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {i.isActive ? (
                        <button
                          className="text-[#5F6368] px-[12px] py-[6px] border border-[#CDDFE9] bg-[#fff] rounded-[7px]"
                          onClick={() =>
                            resendInvitation(i.department, i.email, i.id)
                          }
                        >
                          Resend
                        </button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {/* <TableRow className="px-5 pt-[10px] pb-[13.17px] flex items-center justify-between">
              <button
                className="py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
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
              </button>
              <button
                className="py-[6.5px] px-[11.5px] flex items-center space-x-[6.5px] border-[]"
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
              </button>
            </TableRow> */}
              </TableBody>
            </Table>
          ) : (
            <p>No Users yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardAdminPageWidget
