import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { invitationId } = await req.json()

  if (!invitationId) {
    return NextResponse.json(
      { error: true, message: "invitation Id is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const invitation = await prisma.invitation.findFirst({
      where: { id: invitationId },
      orderBy: { createdAt: "desc" }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: true, message: "Invitation Id does not exist" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully.",
        data: invitation
      },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
