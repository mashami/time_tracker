"use server"

import { Announcement, Role } from "@prisma/client"
import { prisma } from "./prisma"

export const getAllLeavesByDepartment = async (userId: string) => {
  const departmentUser = await prisma.user.findFirst({
    where: { id: userId },
    select: { departmentId: true }
  })
  const leaves = await prisma.leave.findMany({
    where: {
      departmentId: departmentUser?.departmentId,
      NOT: {
        User: {
          role: "manager"
        }
      }
    }
  })

  return leaves
}

export const getAnnouncements = async (
  role: Role,
  companyId: string,
  departmentId: string | null
) => {
  let announcement: Announcement[]

  if (role === "Admin") {
    return (announcement = await prisma.announcement.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" }
    }))
  } else if (role === "manager") {
    return await prisma.announcement.findMany({
      where: {
        OR: [{ companyId }, { departmentId }]
      },
      orderBy: { createdAt: "desc" }
    })
  } else {
    announcement = await prisma.announcement.findMany({
      where: { companyId, departmentId, belong: "all" },
      orderBy: { createdAt: "desc" }
    })
  }

  return announcement
}
