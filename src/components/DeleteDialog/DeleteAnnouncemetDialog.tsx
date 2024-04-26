"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { deleteAnnouncement } from "@/services/user"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DeleteSmallSvg } from "../Svg"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

interface DeleteAnnouncemetDialogProps {
  id: string
}

const DeleteAnnouncemetDialog = ({ id }: DeleteAnnouncemetDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const onClickDeleteHandler = async () => {
    if (!id) {
      return toast({
        variant: "destructive",
        description: "Id is required"
      })
    }

    setIsLoading(true)

    try {
      const result = await deleteAnnouncement(id)

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }

      setIsOpen(false)

      router.refresh()
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
      <div
        className="w-8 h-8 bg-[#FFF4F4] flex items-center justify-center rounded-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <DeleteSmallSvg />
      </div>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="max-w-[448px] p-8">
          <DialogHeader className="space-y-8">
            <DialogTitle className="flex items-center justify-center">
              <div className="w-[84px] h-[84px] flex items-center justify-center rounded-full bg-[#FFF4F4]">
                <DeleteSmallSvg width={42} height={42} />
              </div>
            </DialogTitle>
            <DialogDescription className="p-[18.2px] space-y-8">
              <p className="text-[#FF4A6B] font-ibm_plex_mono font-medium leading-6 text-center">
                Are you sure you want to delete this announcement{" "}
              </p>
              <div className="flex items-center w-full space-x-4">
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
                  className="text-white bg-[#FF4A6B] hover:bg-[#FF4A6B]/70 w-full"
                  text="Delete"
                  style={{
                    boxShadow:
                      " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                  }}
                  onClick={onClickDeleteHandler}
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

export default DeleteAnnouncemetDialog
