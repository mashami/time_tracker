import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId, companyId } = await req.json()

  if (!companyId || !userId) {
    return NextResponse.json(
      { error: true, message: "Company ID and User ID are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const leaves = await prisma.leave.findMany({
      where: { companyId, userId },
      orderBy: { createdAt: "desc" }
    })

    if (!leaves) {
      return NextResponse.json(
        { error: true, message: "NO Leaves yet you have" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Leaves fetched successfully.",
        data: leaves
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
