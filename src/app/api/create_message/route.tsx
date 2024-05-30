import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { message, departmentId } = await req.json()

  const user = await getCurrentUser()
  const companyId = user?.companyId
  const owner = user?.name

  if (!owner || !departmentId || !message) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const companyExit = await prisma.company.findFirst({
      where: { id: companyId }
    })

    if (!companyExit) {
      return NextResponse.json(
        {
          error: true,
          message: "Company Id not found."
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    pusherServer.trigger(departmentId, "incoming-message", { message, owner })

    const result = await prisma.message.create({
      data: {
        owner,
        companyId,
        text: message,
        departmentId
      }
    })

    if (!result) {
      return NextResponse.json(
        {
          error: true,
          message: "Fail to send Message, Please try again"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      { message: "Message send successFull" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
