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
    const leaves = await prisma.leave.findMany({
      where: { companyId }
    })

    if (!leaves) {
      return NextResponse.json(
        { error: true, message: "NO Leaves on this company" },
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
