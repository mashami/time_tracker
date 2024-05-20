import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { departmentId, userId } = await req.json()
  const user = await getCurrentUser()
  const companyId = user?.companyId

  if (!departmentId || !companyId || !userId) {
    return NextResponse.json(
      {
        error: true,
        message: "department ID, user ID and company Id are required"
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

    const userExit = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!userExit) {
      return NextResponse.json(
        { error: true, message: "User ID Is not Exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    if (userExit.role === "manager") {
      return NextResponse.json(
        { message: "User is already manager" },
        { status: HttpStatusCode.OK }
      )
    }

    const findManagerExit = await prisma.user.findFirst({
      where: {
        role: "manager",
        departmentId: departmentId
      }
    })

    if (findManagerExit) {
      await prisma.user.update({
        where: { id: findManagerExit.id },
        data: {
          role: "Staff"
        }
      })
    }

    await prisma.user.update({
      where: { id: userId, departmentId },
      data: { role: "manager" }
    })

    return NextResponse.json(
      { message: "Update User role successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again." },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
