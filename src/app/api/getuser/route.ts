import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "UserId is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    // update user in DB
    const user = await prisma.user.findFirst({
      where: { id: userId },
      orderBy: { createdAt: "desc" }
    })

    if (!user) {
      return NextResponse.json(
        { error: true, message: "UserId does not exist" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const { password, ...rest } = user

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully.",
        user: rest
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
