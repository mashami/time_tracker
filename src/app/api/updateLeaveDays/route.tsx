import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { days, companyId } = await req.json()

  if (!days) {
    return NextResponse.json(
      { error: true, message: "Days  field required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID required" },
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

    const result = await prisma.company.update({
      where: { id: companyId },
      data: {
        leaveNumber: days,
        users: {
          updateMany: {
            where: { companyId },
            data: {
              companyLeaves: days,
              remainingLeave: days
            }
          }
        }
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
      { message: "Leaves days updated sucessfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
