"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signUp } from "@/services/user"
import { useAppContext } from "@/utils/context/AppContext"
import { Invitation } from "@prisma/client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface WidgetSignUpPageProps {
  invitation: Invitation
}
const WidgetSignUpPage = ({ invitation }: WidgetSignUpPageProps) => {
  const [name, setName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [retypedPassword, setRetypedPassword] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const email = invitation.email
  const router = useRouter()

  const { resetUser } = useAppContext()

  const onSubmitHandler = async () => {
    if (!name || !password || !retypedPassword) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }
    if (password !== retypedPassword) {
      return toast({
        variant: "destructive",
        description: "password are not match"
      })
    }
    setIsLoading(true)

    try {
      const result = await signUp({
        email,
        password,
        name,
        companyId: invitation.companyId,
        retypePassword: retypedPassword,
        invitaionId: invitation.id,
        departmentId: invitation.departmentId,
        role: invitation.role
      })
      if (result?.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }
      const resultSign = await signIn("credentials", {
        email: invitation.email,
        password,
        redirect: false
      })

      if (resultSign?.error) {
        toast({
          variant: "destructive",
          description: resultSign.error
        })

        setIsLoading(false)

        return
      }

      resetUser()
      router.push("/dashboard")
      router.refresh()
      return
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occured. Please try again."
      })
      setIsLoading(false)
      return
    }
  }

  return (
    <div className="w-full py-[70px] h-screen bg-[#F9F9F9]">
      <div className="max-w-[550px] mx-auto pt-[63px] pb-[56px] bg-white px-[110.5px] rounded-[16px]">
        <h1 className="text-center font-bricolage font-bold text-[36px] pb-[50px] text-[#006A86]">
          Time Tracker
        </h1>
        <div className="p-6 space-y-8">
          <h1 className="text-[20px] font-medium leading-[30px] text-center">
            Enter your details to continue in the system.
          </h1>
          <form action={""} className="space-y-6">
            <div>
              <label className="text-[14px] leading-5">Your name</label>
              <Input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div>
              <label className="text-[14px] leading-5">Password</label>
              <Input
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div>
              <label className="text-[14px] leading-5">Re-type Password</label>
              <Input
                type="text"
                onChange={(e) => setRetypedPassword(e.target.value)}
                value={retypedPassword}
              />
            </div>
            <Button
              className="text-white w-full py-5"
              text="Continue"
              style={{
                boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
              }}
              loading={isLoading}
              disabled={isLoading}
              onClick={onSubmitHandler}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default WidgetSignUpPage
