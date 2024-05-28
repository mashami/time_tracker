"use client"

import { AddDepartmentDialog } from "@/components/AddDepartmentDialog"
import { DepartmentComp } from "@/components/Department"
import EditUserDropdown from "@/components/Department/EditUserDropdown"
import { Loader } from "@/components/Loader"
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
import { getUsersByDepartment } from "@/services/user"
import { formatDate } from "@/utils/helpers"
import { Department, User } from "@prisma/client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
interface DepartmentProps {
  companyId: string
  departments: Department[]
}
const DepartmentsWidget = ({ companyId, departments }: DepartmentProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [departmentName, setDepartmentName] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [isDepartmentOpen, setIsDepartmentOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>("")

  const router = useRouter()

  const departmentClickHandle = async (id: string, name: string) => {
    if (!id) {
      return toast({
        variant: "destructive",
        description: "ID is required"
      })
    }

    setDepartmentId(id)

    setIsLoading(true)
    try {
      const result = await getUsersByDepartment(id)
      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        setIsDepartmentOpen(false)
        return
      }
      const users = result.data

      setUsers(users)
      setDepartmentName(name)
      setIsDepartmentOpen(true)
      setIsLoading(false)
      router.refresh()
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "An error occured. Please try again."
      })
    }
  }

  return (
    <motion.section
      initial={{ y: "-10%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="mx-[85.5px] space-y-10"
    >
      {!isLoading && !isDepartmentOpen && (
        <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
              Department
            </h1>

            <AddDepartmentDialog companyId={companyId} />
          </div>

          {departments.length > 0 ? (
            <div className="space-y-4">
              {departments.map((d) => (
                <DepartmentComp
                  key={d.id}
                  name={d.name}
                  onClickHandle={departmentClickHandle}
                  id={d.id}
                />
              ))}
            </div>
          ) : (
            <p>No Department yet</p>
          )}
        </div>
      )}

      {!isLoading && isDepartmentOpen && (
        <div className="p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
          <div className="flex items-center ">
            <ArrowLeftSvg
              className="cursor-pointer"
              width={24}
              height={24}
              onClick={() => setIsDepartmentOpen(false)}
            />
            <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono text-center w-full">
              {departmentName}
            </h1>
          </div>

          {users.length > 0 ? (
            <div>
              <Table className="w-full">
                <TableHeader className="w-full">
                  <TableRow className="text-[#475467] text-[14px] font-normal leading-5">
                    <TableHead>Name</TableHead>
                    <TableHead>JoinDate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  {users.map((u) => (
                    <TableRow
                      key={u.id}
                      className=" text-[#475467] text-[14px] font-normal leading-5"
                    >
                      <TableCell className="flex items-center space-x-4">
                        <span className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#006A86]">
                            {u.name[0]}
                          </span>
                          <p className="text-[#475467] text-[14px] font-normal leading-5">
                            {u.name}
                          </p>
                        </span>
                        {u.role === "manager" && (
                          <p className="text-[14px] font-bold">Manager</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.updatedAt ? formatDate(new Date(u.updatedAt)) : ""}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>

                      <TableCell>
                        <EditUserDropdown
                          userId={u.id}
                          department={u.departmentName}
                          departmentId={departmentId}
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
            <div className="flex items-center justify-center">
              <p className="font-ibm_plex_mono font-semibold text-[20px]">
                No Users in {departmentName} yet
              </p>
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="flex items-center mt-48 justify-center">
          <Loader />
        </div>
      )}
    </motion.section>
  )
}

export default DepartmentsWidget
