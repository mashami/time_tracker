"use client"

import { Loader } from "@/components/Loader"
import { MessagesComp } from "@/components/MessagesComp"

import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createMessage } from "@/services/user"
import { Message } from "@prisma/client"
import { useState } from "react"

interface MessageWidgetProps {
  departmentId: string
  messages: Message[]
  name?: string
}

const MessageWidget = ({
  departmentId,
  messages,
  name
}: MessageWidgetProps) => {
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const serializedMessages = messages.map((message) => ({
    text: message.text,
    owner: message.owner,
    id: message.id
  }))

  const onClickHandler = async () => {
    if (!message || !departmentId) {
      return toast({
        variant: "destructive",
        description: "All field required"
      })
    }

    setIsLoading(true)

    try {
      let result

      result = await createMessage({
        departmentId,
        message
      })

      if (result.error) {
        toast({
          variant: "destructive",
          description: result.message
        })
        setIsLoading(false)
        return
      }
      setMessage("")

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
    <div className="space-y-9">
      <div className="space-y-3">
        <h2 className="font-ibm_plex_mono font-semibold">Messages:</h2>
        {messages.length > 0 ? (
          <MessagesComp
            initialMessages={serializedMessages}
            departmentId={departmentId}
            name={name}
          />
        ) : (
          <p>Not messages yet</p>
        )}
      </div>
      <div className="space-y-4 w-[500px]">
        <p className="font-ibm_plex_mono font-semibold">Write a message</p>
        <div className="flex items-center space-x-4 ">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="py-2 px-6 bg-black text-sm text-white rounded-2xl"
            onClick={onClickHandler}
          >
            {!isLoading ? <p>Send</p> : <Loader />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageWidget
