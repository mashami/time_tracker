import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, password, retypedPassword } = await req.json()

  // Check if all fields are sent from client
  if (!name || !email || !password || !retypedPassword) {
    return NextResponse.json(
      { error: true, message: "All fields are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  // Check if passwords match
  if (password !== retypedPassword) {
    return NextResponse.json(
      { error: true, message: "Passwords do not match" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    console.log("reached hereeeeee")

    // Check if Email already exists in DB
    const companyWithEmail = await prisma.company.findFirst({
      where: { email }
    })

    if (companyWithEmail) {
      return NextResponse.json(
        { error: true, message: "The company with this email already exists." },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Save Company in DB
    const company = await prisma.company.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    const user = await prisma.user.create({
      data: {
        name: "Admin",
        email,
        role: "Admin",
        companyId: company.id,
        password: hashedPassword
      }
    })

    if (!company) {
      return NextResponse.json(
        { error: true, message: "Error creating user. Please try again" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
    if (!user) {
      return NextResponse.json(
        { error: true, message: "Error creating user. Please try again" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registering company successfully."
      },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again" },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
