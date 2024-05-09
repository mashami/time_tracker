import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { companyId } = await req.json()

  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    // const company = await prisma.company.findUniqueOrThrow({
    //   where: { id: companyId },
    //   include: { users: true }
    // })
    // const users = company?.users

    const users = await prisma.user.findMany({
      where: {
        companyId,
        isActive: true,
        NOT: {
          role: "Admin"
        }
      },
      orderBy: { createdAt: "desc" }
    })

    if (!users) {
      return NextResponse.json(
        { error: true, message: "NO User yet on this company" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully.",
        data: users
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
