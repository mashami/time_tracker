import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { companyId } = await req.json()

  const pageSize = 2

  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const leaves = await prisma.leave.findMany({
      take: pageSize,
      where: { companyId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Leaves fetched successfully.",
        data: leaves
      },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: true, message: "An error occurred. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
