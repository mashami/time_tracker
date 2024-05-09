import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "User ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const userExit = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!userExit) {
      return NextResponse.json(
        { error: true, message: "User ID Is not Exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true
      }
    })

    return NextResponse.json(
      { message: "User is now approved successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
