"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { UpdateLeaveDays } from "@/services/user"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DialogSvg } from "../Svg"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface AddingLeaveDaysDialogProps {
  companyId: string
}

const AddingLeaveDaysDialog = ({ companyId }: AddingLeaveDaysDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [days, setDays] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const leavesDays = days ? parseInt(days) : 0

  const onClickHandler = async () => {
    if (!companyId || !days) {
      return toast({
        variant: "destructive",
        description: "All field required"
      })
    }
    if (!companyId) {
      return toast({
        variant: "destructive",
        description: "Company ID is required"
      })
    }
    setIsLoading(true)

    try {
      const result = await UpdateLeaveDays({
        companyId,
        leavesDays
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }
      setDays("")

      setIsOpen(false)

      setIsLoading(false)

      toast({
        description: result.message
      })

      router.refresh()

      setIsLoading(false)

      return
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server Error, please try again"
      })

      setIsLoading(false)
      return
    }
  }
  return (
    <>
      <span
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <p className="text-[#006A86] font-medium leading-6">
          Set the number of days for leave
        </p>
        <DialogSvg />
      </span>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader className="space-y-[18.8px]">
            <DialogTitle className="text-black font-medium leading-6 text-[16px] font-ibm_plex_mono">
              Enter the number (days) of leaves in a year
            </DialogTitle>
            <DialogDescription className="border-[#CDDFE9] border-[0.5px] rounded-[18.8px] p-[18.2px] space-y-[18.2px]">
              <Input
                disabled={isLoading}
                placeholder="Add days number of leaves in the year"
                onChange={(e) => setDays(e.target.value)}
                value={days}
              />

              <div className="flex items-center w-full space-x-2">
                <Button
                  variant={"secondary"}
                  className="text-black w-full"
                  text="Cancel"
                  onClick={() => {
                    setIsOpen(false), setDays("")
                  }}
                  disabled={isLoading}
                />
                <Button
                  className="text-white w-full"
                  text="Publish"
                  style={{
                    boxShadow:
                      " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                  }}
                  onClick={onClickHandler}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddingLeaveDaysDialog
