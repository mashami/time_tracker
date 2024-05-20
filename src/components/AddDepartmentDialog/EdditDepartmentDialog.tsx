"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { updateDepartmentName } from "@/services/user"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface EdditDepartmentDialogProps {
  departmentId: string
  name: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const EdditDepartmentDialog = ({
  departmentId,
  name: departmentName,
  setIsOpen,
  isOpen
}: EdditDepartmentDialogProps) => {
  const [name, setName] = useState<string>(departmentName)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const edditDepartmentHandle = async () => {
    if (!departmentId || !departmentName) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    setIsLoading(true)

    try {
      const result = await updateDepartmentName({
        departmentId,
        departmentName: name
      })

      if (result.error) {
        return (
          toast({
            variant: "destructive",
            description: result.message
          }),
          setIsLoading(false)
        )
      }

      toast({
        variant: "default",
        description: result.message
      }),
        setIsLoading(false),
        setName(""),
        setIsOpen(false)

      router.refresh()
      return
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
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader className="space-y-[18.8px]">
          <DialogTitle className="text-black font-medium leading-6 text-[16px]">
            Edit a name of department
          </DialogTitle>
          <DialogDescription className="border-[#CDDFE9] border-[0.5px] rounded-[18.8px] p-[18.2px] space-y-[18.2px]">
            <div className="flex items-center space-x-[18px]">
              <Input
                type="text"
                placeholder="Name of department"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex items-center w-full space-x-2">
              <Button
                variant={"secondary"}
                className="text-black w-full"
                text="Cancel"
                onClick={() => {
                  setIsOpen(false), setName(departmentName)
                }}
                disabled={isLoading}
              />
              <Button
                className="text-white w-full"
                text="Publish"
                style={{
                  boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                }}
                loading={isLoading}
                disabled={isLoading || !name}
                onClick={edditDepartmentHandle}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EdditDepartmentDialog
