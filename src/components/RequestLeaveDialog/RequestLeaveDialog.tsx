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
import { requestLeave } from "@/services/user"
import { useState } from "react"
import { CaretRightSvg } from "../Svg"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

interface AnnouncementDialogProps {
  departmentId: string
}

const RequestLeaveDialog = ({ departmentId }: AnnouncementDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const router = useRouter()

  const typesLeave = [
    { label: "Annual Leave (AL)", value: "Annual Leave" },
    { label: "Casual Leave (CL)", value: "Casual Leave" },
    { label: "Sick Leave (SL)", value: "Sick Leave" },
    { label: "Maternity Leave (ML)", value: "Maternity Leave" },
    { label: "Marriage Leave.", value: "Marriage Leave" },
    { label: "Paternity Leave,", value: "Paternity Leave" },
    { label: "Funeral Leave.", value: "Funeral Leave" }
  ]

  const requestLeaveHandler = async () => {
    // e.stopPropagation()

    if (!title || !startDate || !endDate || !description) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    setIsLoading(true)

    try {
      const result = await requestLeave({
        title,
        startDate,
        endDate,
        description,
        departmentId
      })

      if (result.error) {
        setTitle("")

        setDescription("")

        setIsOpen(false)

        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }

      if (result.OK) {
        // router.refresh()
        toast({
          description: result.message
        })
        setIsLoading(false)
        return
      }
      setTitle("")

      setDescription("")

      setIsOpen(false)

      // router.refresh()

      setIsLoading(false)

      return toast({
        description: result.message
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
      <div
        className="flex items-center space-x-[10px] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <p className="text-[#006A86] text-[16px] font-medium leading-6">
          Request for leave
        </p>
        <CaretRightSvg />
      </div>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader className="space-y-[18.8px]">
            <DialogTitle className="text-black font-medium leading-6 text-[16px]">
              Request for leave
            </DialogTitle>
            <DialogDescription className="border-[#CDDFE9] border-[0.5px] rounded-[18.8px] p-[18.2px] space-y-[18.2px]">
              <Select onValueChange={(value: string) => setTitle(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Leave type" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-scroll">
                  {typesLeave.map((type, i) => (
                    <SelectItem key={i} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-[18px]">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>

              <Textarea
                placeholder=" Type Description here ..."
                className="placeholder:text-[#949494] placeholder:text-[14px] laceholder:leading-[23.5px] laceholder:font-medium"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <div className="flex items-center w-full space-x-2">
                <Button
                  variant={"secondary"}
                  className="text-black w-full"
                  text="Cancel"
                  onClick={() => {
                    setIsOpen(false), setDescription("")
                    setTitle("")
                  }}
                  disabled={isLoading}
                />
                <Button
                  className="text-white w-full"
                  text="Send request"
                  style={{
                    boxShadow:
                      " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                  }}
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={requestLeaveHandler}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RequestLeaveDialog
