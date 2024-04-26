import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { compare } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: true, message: "User with email does not exists." },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const comparePasswords = await compare(password, user.password)

    if (!comparePasswords) {
      return NextResponse.json(
        { error: true, message: "Incorrect password." },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const { password: _, ...restUser } = user

    return NextResponse.json(
      { success: true, message: "User loggedin successfully.", user: restUser },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
