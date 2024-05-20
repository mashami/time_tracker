import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { departmentId } = await req.json()
  const user = await getCurrentUser()
  const companyId = user?.companyId

  if (!departmentId || !companyId) {
    return NextResponse.json(
      { error: true, message: "department ID and company Id are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const departmentExit = await prisma.department.findFirst({
      where: { id: departmentId }
    })

    if (!departmentExit) {
      return NextResponse.json(
        { error: true, message: "department ID Is not Exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
    const users = await prisma.user.findMany({
      where: { companyId: companyId, departmentId: departmentId }
    })

    if (users) {
      await prisma.user.deleteMany({
        where: { companyId: companyId, departmentId }
      })
    }

    await prisma.department.delete({
      where: { id: departmentId }
    })

    return NextResponse.json(
      { message: "Delete department successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
