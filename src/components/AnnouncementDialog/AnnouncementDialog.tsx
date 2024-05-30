"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { createAnnouncement } from "@/services/user"
import { BelongType, Role } from "@prisma/client"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

interface AnnouncementDialogProps {
  departmentId?: string | null
  role: Role
}

const AnnouncementDialog = ({
  departmentId,
  role
}: AnnouncementDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [owner, setOwner] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [audience, setAudience] = useState<BelongType>("all")

  const onClickHandler = async () => {
    if (!description || !owner) {
      return toast({
        variant: "destructive",
        description: "All field required"
      })
    }

    setIsLoading(true)

    try {
      let result
      if (departmentId) {
        result = await createAnnouncement({
          departmentId,
          description,
          owner,
          audience
        })
      }

      result = await createAnnouncement({
        description,
        owner,
        audience
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }
      setDescription("")
      setOwner("")
      setIsOpen(false)

      setIsLoading(false)

      toast({
        description: result.message
      })

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
      <Button
        text="Add new"
        className="bg-black hover:bg-black/80 text-white"
        onClick={() => setIsOpen(true)}
      />
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader className="space-y-[18.8px]">
            <DialogTitle className="text-black font-medium leading-6 text-[16px]">
              Enter new announcement
            </DialogTitle>
            <DialogDescription className="border-[#CDDFE9] border-[0.5px] rounded-[18.8px] p-[18.2px] space-y-[18.2px]">
              <Input
                placeholder="Announcer"
                onChange={(e) => setOwner(e.target.value)}
                value={owner}
              />

              <Textarea
                placeholder="Announcement"
                className="placeholder:text-[#949494] placeholder:text-[14px] laceholder:leading-[23.5px] laceholder:font-medium"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              {role === "Admin" && (
                <div className="p-[10px] bg-[#F9F9F9] rounded-[4px] space-y-[12px] w-full">
                  <div className=" flex items-center justify-between">
                    <p className="text-[14px] font-medium leading-[21px]">
                      All
                    </p>

                    <Switch
                      checked={audience === "all"}
                      onCheckedChange={() => setAudience("all")}
                    />
                  </div>

                  <div className=" flex items-center justify-between">
                    <p className="text-[14px] font-medium leading-[21px]">
                      Managers
                    </p>

                    <Switch
                      checked={audience === "managers"}
                      onCheckedChange={() => setAudience("managers")}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center w-full space-x-2">
                <Button
                  variant={"secondary"}
                  className="text-black w-full"
                  text="Cancel"
                  onClick={() => {
                    setIsOpen(false), setDescription("")
                    setOwner("")
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

export default AnnouncementDialog
