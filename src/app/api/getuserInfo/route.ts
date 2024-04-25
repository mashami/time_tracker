import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return

  // console.log({ userId })

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: true, message: "UserId does not exist" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const { password, ...rest } = user

    // console.log(user)

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
