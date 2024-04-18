/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { toast } from "@/components/ui/use-toast"
import { register } from "@/services/user"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
const signupPage = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [retypedPassword, setRetypedPassword] = useState<string>("")

  const router = useRouter()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password || !retypedPassword) {
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
      const result = await register({
        email,
        password,
        name,
        retypedPassword
      })
      if (result?.error) {
        toast({
          variant: "destructive",
          description: result.message
        })

        return
      }
      const resultSign = await signIn("credentials", {
        email,
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
    <div className="mx-auto w-[260px]">
      <h1 className="font-bricolage text-[20px] font-bold ">Sign a company</h1>
      <form
        action=""
        onSubmit={onSubmitHandler}
        className="flex flex-col space-y-4 "
      >
        <input
          type="text"
          placeholder="Type name ..."
          className="border border-[#Fee] p-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Type Email ..."
          className="border border-[#Fee] p-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Type password .."
          className="border border-[rgb(255,238,238)] p-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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

export default signupPage
