"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { StripeCheckout } from "@/utils/action"
import { usePathname, useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface PaymentDialogProps {
  companyId: string | null
  setIsOpen: Dispatch<SetStateAction<boolean>>

  isOpen: boolean
  email: string
}

const PaymentDialog = ({
  companyId,
  setIsOpen,
  isOpen,

  email: passedEmail
}: PaymentDialogProps) => {
  const [email, setEmail] = useState<string>(passedEmail)
  const [name, setName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const path = usePathname()

  const fullPath = process.env.NEXT_PUBLIC_APP_URL + path

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !companyId || !name) {
      return
    }

    if (!validateEmail(email)) {
      console.log("Invalid email address")
      return
    }

    setIsLoading(true)

    try {
      const url = await StripeCheckout({
        email,
        companyId,
        companyName: name,
        path: fullPath
      })

      console.log(url)

      if (!url) {
        toast({
          variant: "destructive",
          description: "Payment Fail"
        })

        setIsLoading(false)
      }

      router.push(url as string)
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error)
      toast({
        variant: "destructive",
        description: "Payment Fail"
      })
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="px-6 py-8 max-w-[448px]">
          <DialogHeader className="space-y-8">
            <DialogTitle className="text-primary font-medium leading-6 text-[16px] font-ibm_plex_mono text-center ">
              Payment
            </DialogTitle>
            <DialogDescription className=" space-y-[18.2px]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <Input
                    type="email"
                    placeholder="Add email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex items-center w-full space-x-2">
                  <Button
                    type="reset"
                    variant={"secondary"}
                    className="text-black w-full"
                    text="Cancel"
                    disabled={isLoading}
                    onClick={() => {
                      setIsOpen(false), setName("")
                    }}
                  />
                  <Button
                    type="submit"
                    className="text-white w-full"
                    text="Pre-order"
                    // svg={<DirectionArrowRightSvg className="fill-white" />}
                    style={{
                      boxShadow:
                        " 0px 4px 4px 0px rgba(217, 217, 217, 0.25) inset"
                    }}
                    loading={isLoading}
                    disabled={isLoading || !email}
                  />
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PaymentDialog
