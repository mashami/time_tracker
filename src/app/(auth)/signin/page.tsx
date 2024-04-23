/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

      return router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occured. Please try again."
      })
    }
  }

  return (
    <div className="pt-[120px] h-full">
      <div className="w-[550px] px-[115px] pt-[63px] pb-[40px] mx-auto my-auto bg-white rounded-[16px] space-y-6">
        <div className="space-y-[90px] text-center">
          <h1 className="font-bricolage font-bold text-[36px] text-[#006A86]">
            Time Tracker
          </h1>
          <p className="font-medium text-[20px] text-black">
            Sign In to your account
          </p>
        </div>

        <form
          action=""
          onSubmit={onSubmitHandler}
          className="flex flex-col space-y-6"
        >
          <span className="space-y-[6px]">
            <label
              htmlFor=""
              className="text-[14px] leading-5 font-normal text-black"
            >
              Email
            </label>
            <Input
              type="email"
              className="border border-[#Fee] p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>

          <span className="space-y-[6px]">
            <label
              htmlFor=""
              className="text-[14px] leading-5 font-normal text-black"
            >
              Password
            </label>
            <Input
              type="text"
              className="border border-[rgb(255,238,238)] p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>

          <Button
            className="text-white w-full"
            text="Continue"
            style={{
              boxShadow: " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
            }}
          />
        </form>

        <span className="text-[14px] leading-5 font-normal flex items-center space-x-1 justify-center">
          <p className="text-black">Don’t have an account?</p>
          <a href="/signup" className="text-[#006A86]">
            Sign up
          </a>
        </span>
      </div>
    </div>
  )
}

export default signinPage
