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
import { Department } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface InviteDialogProps {
  companyId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const InviteDialog = ({ companyId, setIsOpen, isOpen }: InviteDialogProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [department, setDepartment] = useState<Department>("dev")

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

    setIsLoading(true)

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

        setIsLoading(false)

        return
      }
      setEmail("")

      setDepartment(Department.dev)
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
        <DialogContent className="p-6 max-w-[448px]">
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
                        Marketing Department
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
                    loading={isLoading}
                    disabled={isLoading || !email}
                  />
                  <Button
                    variant={"secondary"}
                    className="text-black w-full"
                    text="Cancel"
                    onClick={() => {
                      setIsOpen(false),
                        setDepartment(Department.dev),
                        setEmail("")
                    }}
                    disabled={isLoading}
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
