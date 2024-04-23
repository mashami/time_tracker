"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { createAnnouncement } from "@/services/user"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CaretRightSvg } from "../Svg"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

interface AnnouncementDialogProps {
  companyId: string
}

const AnnouncementDialog = ({ companyId }: AnnouncementDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [owner, setOwner] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const router = useRouter()

  const onClickHandler = async () => {
    if (!description || !owner || !title) {
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
    try {
      const result = await createAnnouncement({
        companyId,
        description,
        owner,
        title
      })

      if (result.error) {
        return toast({
          variant: "destructive",
          description: result.message
        })
      }
      setDescription("")
      setOwner("")
      setTitle("")
      setIsOpen(false)

      router.refresh()

      return toast({
        description: result.message
      })
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Server Error, please try again"
      })
    }
  }
  return (
    <>
      <div
        className="flex items-center space-x-[10px] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <p className="text-[#006A86] text-[16px] font-medium leading-6">
          Add new
        </p>
        <CaretRightSvg />
      </div>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader className="space-y-[18.8px]">
            <DialogTitle className="text-black font-medium leading-6 text-[16px]">
              Enter new announcement
            </DialogTitle>
            <DialogDescription className="border-[#CDDFE9] border-[0.5px] rounded-[18.8px] p-[18.2px] space-y-[18.2px]">
              <Input
                placeholder="Name of who's announcement"
                onChange={(e) => setOwner(e.target.value)}
                value={owner}
              />
              <Input
                placeholder="Announcement title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <Textarea
                placeholder="Announcement"
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
                    setOwner("")
                    setTitle("")
                  }}
                />
                <Button
                  className="text-white w-full"
                  text="Add Anouncement"
                  style={{
                    boxShadow:
                      " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                  }}
                  onClick={onClickHandler}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AnnouncementDialog
