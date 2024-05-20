import { approveUser, deleteUser } from "@/services/user"
import { formatDate } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

/* eslint-disable react/no-unescaped-entities */
interface UserRequestProp {
  name: string
  departiment: string
  id: string
  date: Date
}

interface isLoadingType {
  isLoadingIsApprov: boolean
  isLoadingIsRej: boolean
}

//
const UserRequest = ({ name, departiment, id, date }: UserRequestProp) => {
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    isLoadingIsApprov: false,
    isLoadingIsRej: false
  })

  const router = useRouter()

  const approveUserHandler = async () => {
    if (!id) {
      return toast({
        variant: "destructive",
        description: "ID is required"
      })
    }

    setIsLoading({ ...isLoading, isLoadingIsApprov: true })

    try {
      const result = await approveUser(id)

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading({ ...isLoading, isLoadingIsApprov: false })
        return
      }

      router.refresh()
      setIsLoading({ ...isLoading, isLoadingIsApprov: false })

      toast({
        description: result.message
      })

      return
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server Error, please try again"
      })

      setIsLoading({ ...isLoading, isLoadingIsApprov: false })
      return
    }
  }

  const rejectUserHandler = async () => {
    if (!id) {
      return toast({
        variant: "destructive",
        description: "User ID is required"
      })
    }
    setIsLoading({
      ...isLoading,
      isLoadingIsRej: true
    })
    try {
      const result = await deleteUser(id)

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading({
          ...isLoading,
          isLoadingIsRej: false
        })
        return
      }

      router.refresh()

      setIsLoading({
        ...isLoading,
        isLoadingIsRej: false
      })

      return toast({
        description: "Staff has deleted sucessfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Server error, Please Try again buddy!"
      })

      setIsLoading({
        ...isLoading,
        isLoadingIsRej: false
      })

      return
    }
  }

  const dateTime = formatDate(date)

  return (
    <div className="space-y-6 bg-[#F9F9F9] p-[10px] rounded-[12px]">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#006A86]">
            <p className="text-[22.397px] font-medium leading-[31px] text-white">
              {name[0].toUpperCase()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-[14px] leading-4 text-black">
              {name}
            </p>
            <p className="text-[13px] font-medium leading-4 text-black">
              {dateTime}
            </p>
          </div>
        </div>

        <div className="h-6 py-1 px-[7px] bg-[#ECECEC] rounded-md">
          <p className="text-[12px] font-medium leading-4">{departiment}</p>
        </div>
      </div>

      <div className=" pl-12 space-y-6">
        <p className=" text-[13px] leading-4 text-black">
          The user needs approval to become a part of the staff in the{" "}
          {departiment} department.
        </p>

        <div className="grid grid-cols-2">
          <div className="flex items-center w-full space-x-4">
            <Button
              className="text-white w-full py-5"
              text="Approve"
              style={{
                boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
              }}
              onClick={approveUserHandler}
              loading={isLoading.isLoadingIsApprov}
              disabled={isLoading.isLoadingIsApprov}
            />

            <Button
              variant={"secondary"}
              className="text-black w-full px-7 py-5 bg-white"
              text="Reject"
              onClick={rejectUserHandler}
              loading={isLoading.isLoadingIsRej}
              disabled={isLoading.isLoadingIsRej}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRequest
