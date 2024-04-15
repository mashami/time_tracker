import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, password, retypePassword, companyId } = await req.json()

  if (!name || !email || !password || !retypePassword) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  if (retypePassword !== password) {
    return NextResponse.json(
      { error: true, message: "Password doesn't match" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }
  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Provide the company Id" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }
  // 661cec2a17a30d19ba2a8e61

  try {
    // Retrieve users from the company database

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { users: true }
    })

    if (!company) {
      return NextResponse.json(
        { error: true, message: "Company not found." },
        { status: HttpStatusCode.NOT_FOUND }
      )
    }

    const users = company.users

    //Verifying if email exists

    const userWithEmail = users?.find((user) => user.email === email)

    if (userWithEmail) {
      return NextResponse.json(
        { error: true, message: "User with this email exists." },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Save user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "Staff",
        companyId,
        password: hashedPassword
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: true, message: "Error creating user. Please try again" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "User create successfully."
      },
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
