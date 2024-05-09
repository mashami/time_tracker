import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"
import { sendMail } from "@/utils/mailService"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  const user = await getCurrentUser()

  const companyID = user?.companyId

  if (!userId || !companyID) {
    return NextResponse.json(
      { error: true, message: "User ID and Company ID are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const checkUserExit = await prisma.user.findFirst({
      where: { id: userId, companyId: companyID }
    })

    if (checkUserExit) {
      const email = checkUserExit.email

      const company = await prisma.company.findFirst({
        where: { id: companyID }
      })

      try {
        await prisma.leave.deleteMany({
          where: { companyId: companyID, userId: userId }
        })
      } catch (error) {
        console.error("Error deleting records:", error)
      }

      await prisma.user.delete({
        where: { id: userId, companyId: companyID }
      })

      await prisma.invitation.delete({
        where: { email: email, companyId: companyID }
      })

      const emailContent = ` You are no longer in ${company?.name} company`

      await sendMail(`${company?.name} company Email`, email, emailContent)

      return NextResponse.json(
        { message: "Delete staff successfully" },
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
