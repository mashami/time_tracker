/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const signinPage = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const router = useRouter()

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      return toast({
        variant: "destructive",
        description: "All fields are required"
      })
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          description: result.error
        })

        return
      }
      console.log(result)

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
      <h1 className="font-bricolage text-[20px] font-bold pb-4">Sigin </h1>
      <form
        action=""
        onSubmit={onSubmitHandler}
        className="flex flex-col space-y-3 "
      >
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

        <button className="bg-green-500 flex items-center rounded-full h-10 w-fit px-4">
          Signin
        </button>
      </form>
    </div>
  )
}

export default signinPage
