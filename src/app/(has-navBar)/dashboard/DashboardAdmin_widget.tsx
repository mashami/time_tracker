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
import { formatDate } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardAdminPageWidgetProp {
  companyId: string
  users: User[]
  invitations: Invitations[]
  announcements: Announcement[]
}

export interface isLoadingType {
  isLoadingInvite: boolean
  isLoadingDelete: boolean
  isLoadingReInvite: boolean
}

const DashboardAdminPageWidget = ({
  companyId,

  users,
  invitations,
  announcements
}: DashboardAdminPageWidgetProp) => {
  const [email, setEmail] = useState<string>("")
  const [department, setDepartment] = useState<Department>("dev")
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    isLoadingInvite: false,
    isLoadingDelete: false,
    isLoadingReInvite: false
  })

  const router = useRouter()

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

    setIsLoading({
      ...isLoading,
      isLoadingInvite: true
    })

    try {
      const result = await inviteUser({
        companyId,
        department,
        email
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })

        setIsLoading({
          ...isLoading,
          isLoadingInvite: false
        })

        return
      }
      setEmail("")

      setDepartment(Department.dev)
      router.refresh()

      setIsLoading({
        ...isLoading,
        isLoadingInvite: false
      })

      return toast({
        variant: "default",
        description: "User invited successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })
      setIsLoading({
        ...isLoading,
        isLoadingInvite: false
      })
      return
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

    setIsLoading({
      ...isLoading,
      isLoadingReInvite: true
    })

    try {
      const result = await inviteUser({
        companyId,
        department,
        email,
        invitationId: id
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.error
        })
        setIsLoading({
          ...isLoading,
          isLoadingReInvite: false
        })
        return
      }

      toast({
        variant: "default",
        description: result.message
      })

      router.refresh()

      setIsLoading({
        ...isLoading,
        isLoadingReInvite: false
      })

      return
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })

      setIsLoading({
        ...isLoading,
        isLoadingReInvite: false
      })

      return
    }
  }

  const deleteUserHandler = async (userId: string) => {
    if (!userId || !companyId) {
      return toast({
        variant: "destructive",
        description: "Ids are required"
      })
    }
    setIsLoading({
      ...isLoading,
      isLoadingDelete: true
    })
    try {
      const result = await deleteUser({ userId, companyId })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading({
          ...isLoading,
          isLoadingDelete: false
        })
        return
      }

      router.refresh()

      setIsLoading({
        ...isLoading,
        isLoadingDelete: false
      })

      return toast({
        description: "Staff has deleted sucessfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server error, Please Try again buddy!"
      })

      setIsLoading({
        ...isLoading,
        isLoadingDelete: false
      })

      return
    }
  }

  return (
    <section className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
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
                  loading={isLoading.isLoadingInvite}
                  disabled={isLoading.isLoadingInvite}
                />
                <Button
                  variant={"secondary"}
                  className="text-black w-full"
                  text="Cancel"
                  onClick={() => {
                    setDepartment(Department.dev), setEmail("")
                  }}
                  disabled={isLoading.isLoadingInvite}
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
                    <div className="flex items-start space-x-[10px] pb-[16px]">
                      <span className="w-[12px] h-[12px] rounded-full bg-[#006A86] flex flex-shrink-0 mt-1"></span>
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
        <div className="w-full p-4 rounded-[24px] bg-white space-y-6">
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
                        <Button
                          className="text-[#B42318] px-[12px] py-[6px] border border-[#FEF3F2]  bg-[#fff] hover:bg-[#fff]/80 rounded-[7px]"
                          onClick={() => deleteUserHandler(i.id)}
                          text="Delete"
                          loading={isLoading.isLoadingDelete}
                          disabled={isLoading.isLoadingDelete}
                        />
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
                        <Button
                          className="text-[#5F6368] px-[12px] py-[6px] border border-[#CDDFE9] hover:bg-white/80 bg-[#fff] rounded-[7px]"
                          onClick={() =>
                            resendInvitation(i.department, i.email, i.id)
                          }
                          text="Resend"
                          loading={isLoading.isLoadingReInvite}
                        />
                      ) : (
                        <></>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No Users yet</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default DashboardAdminPageWidget
