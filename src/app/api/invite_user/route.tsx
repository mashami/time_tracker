import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"
import { sendMail } from "@/utils/mailService"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, role, departmentId, invitationId } = await req.json()

  const user = await getCurrentUser()

  const companyId = user?.companyId

  if (!email || !role || !companyId || !departmentId) {
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
        { error: true, message: "Company Id doesn't exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const companyName = companyExit.name

    const userExit = await prisma.user.findFirst({
      where: { email, companyId }
    })

    if (userExit) {
      return NextResponse.json(
        {
          error: true,
          message: " User is exit no need for resending invite to him or her"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const departmentExit = await prisma.department.findFirst({
      where: { id: departmentId }
    })

    if (!departmentExit) {
      return NextResponse.json(
        {
          error: true,
          message: "The Id passed for department is not exit"
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const departmentName = departmentExit.name

    const invitation = await prisma.invitation.create({
      data: {
        email,
        companyId,
        departmentName,
        isActive: true,
        role,
        departmentId
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: true, message: "Error creating user. Please try again" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const invitationLink = `${process.env.APP_URL}/invite/${invitation.id}`

    const emailContent = `
    <p>
    Click on the following link to sign up as staff of ${companyName} company:
    <br>
    <Link href="invite/[invitationId]" as={${invitationLink}}>
      Sign Up as ${role} from ${departmentExit?.name} department
    </Link>
  </p>
`

    await sendMail(`${companyName} company invitation`, email, emailContent)

    console.log("invitationLink ===>", invitationLink)

    return NextResponse.json(
      { message: "Invitation send" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
