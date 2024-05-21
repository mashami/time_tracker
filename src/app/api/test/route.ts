import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { startDate, endDate, title, description, userId, companyId } =
    await req.json()

  if (!startDate || !endDate || !title || !description) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }
  if (!userId || !companyId) {
    return NextResponse.json(
      { error: true, message: "User ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        users: { some: { id: userId } }
      }
    })

    if (!company) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Company doesn't exist or user isn't associated with the company"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const user = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          message: "User doesn't exist or isn't associated with the company"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const isUserHaveLeavePending = await prisma.leave.findFirst({
      where: {
        userId,
        companyId,
        status: { equals: "Pending" }
      }
    })

    if (isUserHaveLeavePending !== null) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Your already have a pending leave just wait for the the first leave request"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again" },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
