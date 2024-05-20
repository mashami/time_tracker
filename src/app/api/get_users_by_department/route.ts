import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { departmentID } = await req.json()

  const user = await getCurrentUser()
  const companyID = user?.companyId

  if (!companyID || !departmentID) {
    return NextResponse.json(
      { error: true, message: "department ID and Company ID are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        companyId: companyID,
        departmentId: departmentID,
        isActive: true
      },
      orderBy: { createdAt: "asc" }
    })

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
