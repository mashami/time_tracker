import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { owner, description, departmentId, audience } = await req.json()

  const user = await getCurrentUser()
  const companyId = user?.companyId

  if (!owner || !audience || !description) {
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

    if (departmentId) {
      const result = await prisma.announcement.create({
        data: {
          description,
          owner,
          belong: audience,
          companyId,
          departmentId
        }
      })

      if (!result) {
        return NextResponse.json(
          {
            error: true,
            message: "Announcement failed to add. Please try again"
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }

      pusherServer.trigger(departmentId, "incoming-annoucement", result)

      return NextResponse.json(
        { message: "Announcement added sucessfully" },
        { status: HttpStatusCode.OK }
      )
    }

    if (user.role === "Admin") {
      const result = await prisma.announcement.create({
        data: {
          description,
          owner,
          belong: audience,
          companyId
        }
      })

      if (!result) {
        return NextResponse.json(
          {
            error: true,
            message: "Announcement failed to add. Please try again"
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }

      pusherServer.trigger(departmentId, "incoming-annoucement", result)

      return NextResponse.json(
        { message: "Announcement added sucessfully" },
        { status: HttpStatusCode.OK }
      )
    }

    return NextResponse.json(
      { message: "Announcement added sucessfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
