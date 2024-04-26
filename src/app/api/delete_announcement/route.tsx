import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { announcementId } = await req.json()

  if (!announcementId) {
    return NextResponse.json(
      { error: true, message: "announcement ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const announcementExit = await prisma.announcement.findFirst({
      where: { id: announcementId }
    })

    if (!announcementExit) {
      return NextResponse.json(
        { error: true, message: "announcement ID Is not Exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    await prisma.announcement.delete({
      where: { id: announcementId }
    })

    return NextResponse.json(
      { message: "Delete Announcement successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
