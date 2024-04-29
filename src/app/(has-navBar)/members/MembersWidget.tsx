"use client"

import { DeleteUserDialog } from "@/components/DeleteDialog"
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
import { deleteUser, inviteUser } from "@/services/user"
import { formatDate } from "@/utils/helpers"
import { Invitations, User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface MembersWidgetProps {
  users: User[]
  companyId: string
  invitations: Invitations[]
}

export interface isLoadingType {
  isLoadingInvite: boolean
  isLoadingDelete: boolean
  isLoadingReInvite: boolean
}

const MembersWidget = ({
  users,
  companyId,
  invitations
}: MembersWidgetProps) => {
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    isLoadingInvite: false,
    isLoadingDelete: false,
    isLoadingReInvite: false
  })
  const router = useRouter()

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
    <section className="w-full p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
        Members
      </h1>

      <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
        <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
          Workers management
        </h2>
        {users.length > 0 ? (
          <div className="py-0">
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
                        <DeleteUserDialog companyId={companyId} id={i.id} />
                      ) : (
                        ""
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
          <p>No Users yet</p>
        )}
      </div>
      <div className="w-full p-4 rounded-[24px] bg-white space-y-[24px]">
        <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
          Invitations management
        </h2>
        {invitations.length > 0 ? (
          <div className="py-0">
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
          <p>No Users yet</p>
        )}
      </div>
    </section>
  )
}

export default MembersWidget
