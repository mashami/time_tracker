"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signUp } from "@/services/user"
import { Invitations } from "@prisma/client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface WidgetSignUpPageProps {
  invitation: Invitations
}
const WidgetSignUpPage = ({ invitation }: WidgetSignUpPageProps) => {
  const [name, setName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [retypedPassword, setRetypedPassword] = useState<string>("")
  const email = invitation.email
  const router = useRouter()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    try {
      const result = await signUp({
        email: invitation.email,
        password,
        name,
        department: invitation.department,
        companyId: invitation.companyId,
        retypePassword: retypedPassword,
        invitaionId: invitation.id
      })
      if (result?.error) {
        toast({
          variant: "destructive",
          description: result.message
        })

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

        return
      }

      return router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occured. Please try again."
      })
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-[550px] mx-auto pt-[63px] pb-[56px] bg-white px-[110.5px] rounded-[16px]">
        <h1 className="font-bricolage font-bold text-[36px] pb-[50px] text-[#006A86]">
          Time Tracker
        </h1>
        <div className="p-6 space-y-8">
          <h1 className="text-[20px] font-medium leading-[30px] text-center">
            Enter your details to continue in the system.
          </h1>
          <form action={""} onSubmit={onSubmitHandler} className="space-y-6">
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
              className="text-white w-full"
              text="Continue"
              style={{
                boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
              }}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default WidgetSignUpPage
