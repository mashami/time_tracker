"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { inviteUser } from "@/services/user"
import { isEmailValid } from "@/utils/helpers"
import { Department, Role } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { toast } from "../ui/use-toast"

interface InviteDialogProps {
  departmentId: string | null
  setIsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  departments: Department[]
  role: Role
}

const InviteDialog = ({
  departmentId: departmentIdPassed,
  role: rolePassed,
  setIsOpen,
  isOpen,
  departments
}: InviteDialogProps) => {
  const [email, setEmail] = useState<string>("")
  const [role, setRole] = useState<Role>("Staff")
  const [departmentId, setDepartmentId] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const departmentIdInvite = departmentId
    ? departmentId
    : (departmentIdPassed as string)

  const onSubmitInviteFormHandler = async () => {
    if (!isEmailValid(email)) {
      return toast({
        variant: "destructive",
        description: "Provide Valid email"
      })
    }

    setIsLoading(true)

    try {
      const result = await inviteUser({
        departmentId: departmentIdInvite,
        role,
        email
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })

        setIsLoading(false)

        return
      }
      setEmail("")

      router.refresh()
      setIsLoading(false)
      setIsOpen(false)

      return toast({
        variant: "default",
        description: "User invited successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server error, Please Try again"
      })
      setIsLoading(false)
      return
    }
  }

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="px-6 py-8 max-w-[448px]">
          <DialogHeader className="space-y-8">
            <DialogTitle className="text-black font-medium leading-6 text-[16px] font-ibm_plex_mono">
              Enter details to send an invite
            </DialogTitle>
            <DialogDescription className=" space-y-[18.2px]">
              <div className="space-y-6">
                <div className="space-y-6">
                  <Input
                    type="email"
                    placeholder="Add email her"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {rolePassed === "Admin" && (
                    <div className="space-y-6">
                      <Select
                        onValueChange={(value: string) =>
                          setDepartmentId(value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>

                        <SelectContent>
                          {departments.length > 0 ? (
                            departments.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name} Department
                              </SelectItem>
                            ))
                          ) : (
                            <p className="text-[12px] font-ibm_plex_mono font-medium leading-4 text-center py-6">
                              No department yet, Please create Department
                            </p>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="p-[10px] bg-[#F9F9F9] rounded-[4px] space-y-[12px] w-full">
                        <div className=" flex items-center justify-between">
                          <p className="text-[14px] font-medium leading-[21px]">
                            User
                          </p>

                          <Switch
                            checked={role === "Staff"}
                            onCheckedChange={() => setRole("Staff")}
                          />
                        </div>

                        <div className=" flex items-center justify-between">
                          <p className="text-[14px] font-medium leading-[21px]">
                            Manager
                          </p>

                          <Switch
                            checked={role === "manager"}
                            onCheckedChange={() => setRole("manager")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center w-full space-x-2">
                  <Button
                    variant={"secondary"}
                    className="text-black w-full"
                    text="Cancel"
                    onClick={() => {
                      setIsOpen(false), setDepartmentId(""), setEmail("")
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    className="text-white w-full"
                    text="Send Invite"
                    style={{
                      boxShadow:
                        " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                    }}
                    onClick={onSubmitInviteFormHandler}
                    loading={isLoading}
                    disabled={isLoading || !email}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InviteDialog
