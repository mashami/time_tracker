"use client"

import { DeleteUserDialog } from "@/components/DeleteDialog"
import { Holiday } from "@/components/Holiday"
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
import { UserRequest } from "@/components/UserRequest"
import { cn } from "@/lib/utils"
import { deleteUser } from "@/services/user"
import { formatDate } from "@/utils/helpers"
import { User } from "@prisma/client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface MembersWidgetProps {
  users: User[]
  companyId: string
  userRequests: Pick<
    User,
    "id" | "departmentName" | "departmentId" | "name" | "updatedAt"
  >[]
}

export interface isLoadingType {
  isLoadingInvite: boolean
  isLoadingDelete: boolean
  isLoadingReInvite: boolean
}

const MembersWidget = ({
  users,
  companyId,
  userRequests
}: MembersWidgetProps) => {
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    isLoadingInvite: false,
    isLoadingDelete: false,
    isLoadingReInvite: false
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [id, setId] = useState<string>("")
  const router = useRouter()

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
      const result = await deleteUser(userId)

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
    <>
      <motion.section
        initial={{ y: "-10%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-full p-6 bg-[#F9F9F9] rounded-[32px] space-y-8"
      >
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Members
        </h1>
        <div className="w-full grid grid-cols-2 gap-6">
          <div>
            <div className="space-y-6 bg-white p-4 rounded-[24px]">
              <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
                Upcomming Holidays
              </h2>
              <div className="max-h-[320px] overflow-y-scroll">
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
                  <Holiday />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-6 bg-white p-4 rounded-[24px]">
              <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
                User invite requests
              </h2>
              {userRequests.length > 0 ? (
                userRequests.map((user) => (
                  <div
                    key={user.id}
                    className="max-h-[320px] overflow-y-scroll space-y-4"
                  >
                    <UserRequest
                      name={user.name}
                      departiment={
                        user.departmentName ? user.departmentName : ""
                      }
                      id={user.id}
                      date={user.updatedAt}
                    />
                  </div>
                ))
              ) : (
                <p className="flex items-center justify-center font-ibm_plex_mono font-medium">
                  {" "}
                  No user request yet
                </p>
              )}
            </div>
          </div>
        </div>

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
                      <TableCell>{i.departmentName}</TableCell>

                      <TableCell>
                        <Button
                          className="text-[#B42318] px-[12px] py-[6px] border border-[#FEF3F2]  bg-[#fff] hover:bg-[#fff]/80 rounded-[7px]"
                          onClick={() => {
                            setIsOpen(true), setId(i.id)
                          }}
                          text="Delete"
                        />
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
      </motion.section>
      <DeleteUserDialog isOpen={isOpen} setIsOpen={setIsOpen} id={id} />
    </>
  )
}

export default MembersWidget
