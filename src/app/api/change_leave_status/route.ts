import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { sendMail } from "@/utils/mailService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { leaveId, status } = await req.json()

  if (!leaveId) {
    return NextResponse.json(
      { error: true, message: "leaveId ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }
  if (!status) {
    return NextResponse.json(
      { error: true, message: "status and email are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const leave = await prisma.leave.findFirst({
      where: { id: leaveId }
    })

    let companyName

    if (leave && leave.companyId) {
      const company = await prisma.company.findFirst({
        where: { id: leave.companyId }
      })
      companyName = company?.name
    }

    if (!leave) {
      return NextResponse.json(
        { error: true, message: "NO Leave founded " },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    if (status === "IsApproved") {
      await prisma.leave.update({
        where: { id: leaveId },
        data: {
          status: "IsApproved"
        }
      })
      await sendMail(
        `${companyName} company invitation`,
        leave.email,
        "Your Leave has Approved "
      )
      return NextResponse.json(
        {
          success: true,
          message: "Leave approved successfully.",
          data: leave
        },
        { status: HttpStatusCode.OK }
      )
    } else {
      await prisma.leave.update({
        where: { id: leaveId },
        data: {
          status: "Rejected"
        }
      })

      await sendMail(
        `${companyName} company invitation`,
        leave.email,
        "Your Leave has Rejected "
      )
      return NextResponse.json(
        {
          success: true,
          message: "Leave Rejected successfully.",
          data: leave
        },
        { status: HttpStatusCode.OK }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
