import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const user = await getCurrentUser()

  if (!user?.companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID and User ID are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const companyExit = await prisma.company.findFirst({
      where: { id: user.companyId }
    })

    if (!companyExit) {
      return NextResponse.json(
        { error: true, message: "This Company not exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const result = await prisma.department.findMany({
      where: { companyId: user.companyId }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Departments fetched successfully.",
        data: result
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
