import { prisma } from "@/lib/prisma"
import { HttpStatusCode } from "@/utils/enums"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, companyId } = await req.json()

  if (!name || !companyId) {
    return NextResponse.json(
      { error: true, message: "All fields required" },
      { status: HttpStatusCode.BAD_REQUEST }
    )
  }

  try {
    const nameExit = await prisma.department.findUnique({
      where: { name }
    })

    if (nameExit) {
      return NextResponse.json(
        { error: true, message: "Name provided is Exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const companyExit = await prisma.company.findFirst({
      where: { id: companyId }
    })

    if (!companyExit) {
      return NextResponse.json(
        { error: true, message: "Company Id isn't exit" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const result = await prisma.department.create({
      data: {
        name,
        companyId
      }
    })

    if (!result) {
      return NextResponse.json(
        { error: true, message: "Faild to create a department" },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      { success: true, message: "Department created successfully" },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "An error occured. Please try again" },
      { status: HttpStatusCode.INTERNAL_SERVER }
    )
  }
}
