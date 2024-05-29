"use client"
import { pusherClient } from "@/lib/pusher"
import { FC, useEffect, useState } from "react"

interface MessagesCompProps {
  initialMessages: {
    text: string
    owner: string
    id: string
  }[]
  departmentId: string
  name?: string
}

interface MessageProps {
  message: string
  owner: string
}

const MessagesComp: FC<MessagesCompProps> = ({
  initialMessages,
  departmentId,
  name
}) => {
  const [incomingMessages, setIncomingMessages] = useState<MessageProps[]>([])

  useEffect(() => {
    const handleIncomingMessage = ({ message, owner }: MessageProps) => {
      setIncomingMessages((prev) => [...prev, { message, owner }])
    }

    pusherClient.subscribe(departmentId)
    pusherClient.bind("incoming-message", handleIncomingMessage)

    return () => {
      pusherClient.unbind("incoming-message", handleIncomingMessage)
      pusherClient.unsubscribe(departmentId)
    }
  }, [departmentId])

  return (
    <div className="space-y-3">
      {initialMessages.map((message) => (
        <div key={message.id} className="flex space-x-2">
          <p className="font-medium">
            {name === message.owner ? "You" : message.owner}:
          </p>
          <p>{message.text}</p>
        </div>
      ))}

      {incomingMessages.map((msg, i) => (
        <div key={i} className="flex space-x-2">
          <p className="font-medium">
            {name === msg.owner ? "You" : msg.owner}:
          </p>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  )
}

export default MessagesComp
