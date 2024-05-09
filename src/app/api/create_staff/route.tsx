import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { sendMail } from "@/utils/mailService"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, role, companyId, departmentId, invitationId } =
    await req.json()

  if (!email || !role || !companyId || !departmentId) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    if (invitationId) {
      const companyExit = await prisma.company.findFirst({
        where: { id: companyId }
      })
      const checkUserInvitation = await prisma.invitation.findFirst({
        where: { id: invitationId, isActive: true }
      })

      if (checkUserInvitation) {
        const invitationLink = `${process.env.APP_URL}/invite/${checkUserInvitation.id}`

        const emailContent = `
      <p>
      Click on the following link to sign up as staff of ${companyExit?.name} company:
      <br>
      <Link href="invite/[invitationId]" as={${invitationLink}}>
        Sign Up
      </Link>
    </p>`

        console.log("invitationLink ===>", invitationLink)

        await sendMail(
          `${companyExit?.name} company invitation`,
          email,
          emailContent
        )
        return NextResponse.json(
          { message: "Resend Invitation successfully" },
          { status: HttpStatusCode.OK }
        )
      }
    }

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

    const checkInvitationIsActive = await prisma.invitation.findFirst({
      where: { email, isActive: true }
    })
    if (checkInvitationIsActive) {
      return NextResponse.json(
        { error: true, message: "An invite is in pending" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const checkDepartment = await prisma.department.findFirst({
      where: { id: departmentId }
    })

    if (checkInvitationIsActive) {
      return NextResponse.json(
        { error: true, message: "An invite is in pending" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        companyId,
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
      Sign Up as staff from ${checkDepartment?.name} department
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
