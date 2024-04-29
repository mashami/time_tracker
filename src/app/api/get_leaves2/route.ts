import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { companyId, page } = await req.json()

  const pageSize = 2

  if (!companyId) {
    return NextResponse.json(
      { error: true, message: "Company ID is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }
  // console.log(page)

  try {
    const totalCount = await prisma.leave.count({ where: { companyId } })
    const totalPages = Math.ceil(totalCount / pageSize)

    // console.log("totalCount ===>", totalCount)

    // console.log("totalPages ===>", totalPages)

    const leaves = await prisma.leave.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { companyId },
      orderBy: { createdAt: "desc" }
    })

    if (!leaves || leaves.length === 0) {
      return NextResponse.json(
        { error: true, message: "No Leaves found for this company" },
        { status: HttpStatusCode.NOT_FOUND }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Leaves fetched successfully.",
        data: leaves,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages
        }
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
