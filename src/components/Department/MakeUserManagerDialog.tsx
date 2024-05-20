"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { updateUserManager } from "@/services/user"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

interface MakeUserManagerDialogProps {
  userId: string
  departmentId: string
  nameDepartment: string | null
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const MakeUserManagerDialog = ({
  userId,
  nameDepartment,
  departmentId,
  isOpen,
  setIsOpen
}: MakeUserManagerDialogProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const makerUserManagerHandle = async () => {
    if (!userId || !departmentId!) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    setIsLoading(true)

    try {
      const result = await updateUserManager({
        departmentId,
        userId
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
      <DialogContent className="max-w-[410px]">
        <DialogHeader className="space-y-8">
          <DialogTitle className="space-y-7">
            <div className="mx-auto w-[100px] h-[100px] border-[#CDDFE9] border-[0.5px] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={64}
                height={64}
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z" />
              </svg>
            </div>
            <p className="text-black font-medium text-[16px] text-center leading-8">
              Are sure you want this user to be manager of this {nameDepartment}{" "}
              Department
            </p>
          </DialogTitle>
          <DialogDescription className="p-[18.2px] space-y-[18.2px]">
            <div className="flex items-center w-full space-x-2">
              <Button
                variant={"secondary"}
                className="text-black w-full"
                text="Cancel"
                onClick={() => {
                  setIsOpen(false)
                }}
                disabled={isLoading}
              />
              <Button
                className="text-white w-full"
                text="Confirm"
                style={{
                  boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                }}
                loading={isLoading}
                disabled={isLoading}
                onClick={makerUserManagerHandle}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MakeUserManagerDialog
