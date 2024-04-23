import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { owner, title, description, companyId } = await req.json()

  if (!owner || !title || !description || !companyId) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
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

    const result = await prisma.announcement.create({
      data: {
        description,
        owner,
        title,
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
