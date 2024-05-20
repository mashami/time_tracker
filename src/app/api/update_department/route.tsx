import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { departmentId, departmentName } = await req.json()
  const user = await getCurrentUser()
  const companyId = user?.companyId

  if (!departmentId || !companyId || !departmentName) {
    return NextResponse.json(
      {
        error: true,
        message: "department ID, department Name and company Id are required"
      },
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
      await prisma.user.updateMany({
        where: { companyId: companyId, departmentId },
        data: {
          departmentName
        }
      })
    }

    await prisma.department.update({
      where: { id: departmentId },
      data: { name: departmentName }
    })

    return NextResponse.json(
      { message: "Update department name successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
