"use client"

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
    <div>
      <h1>{email} most welcome</h1>
      <form
        action=""
        onSubmit={onSubmitHandler}
        className="flex flex-col space-y-2 w-[250px] py-12"
      >
        <label htmlFor="">Name:</label>
        <input
          type="text"
          placeholder="Type name ..."
          className="border border-[#Fee] p-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="">password:</label>
        <input
          type="text"
          placeholder="Type password .."
          className="border border-[rgb(255,238,238)] p-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="">Retype password:</label>
        <input
          type="text"
          placeholder="Type Retype password .."
          className="border border-[#Fee] p-2 rounded-md"
          value={retypedPassword}
          onChange={(e) => setRetypedPassword(e.target.value)}
        />

        <button className="bg-green-500 flex items-center rounded-full h-10 w-fit px-4">
          Sign up
        </button>
      </form>
    </div>
  )
}

export default WidgetSignUpPage
