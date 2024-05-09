import { Loader } from "@/components/Loader"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { getLeaves, getLeavesByUser } from "@/services/user"
import { Prisma, Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import LeaveAdminWidget from "./LeaveAdminWidget"
import LeaveManagerWidget from "./LeaveManagerWidget"
import LeaveUserWidget from "./LeaveUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>

const LeavesPage = async () => {
  //Instead of using session again while I have context holds a user who is sign in  I will be using a context API later

  const user = await getCurrentUser()
  if (!user) {
    return redirect("/signin")
  }

  const userId = user.id
  const companyId = user.companyId

  const leavesAll = await getLeaves(companyId)
  const role = user.role as Role

  const getuserDepartment = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      departmentId: true,
      departmentName: true
    }
  })

  const remaingDays = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      remainingLeave: true
    }
  })

  if (!remaingDays) return

  const departmentId = getuserDepartment?.departmentId
  //\/\\\/\\/\/\/\/\/\/\/\/\/\/\/\  ADMIN   /\//\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\//\/\\\/\/\\/\/\/\/\/\/
  if (role === "Admin") {
    try {
      // const data = await getUser(userId)
      // const user = data?.user as UserWithRelations

      const managersLeaves = await prisma.leave.findMany({
        where: {
          companyId,

          NOT: {
            User: {
              role: "Staff"
            }
          }
        }
      })

      const leavesDays = await prisma.company.findFirst({
        where: { id: companyId },
        select: {
          leaveNumber: true
        }
      })

      return (
        <div>
          <LeaveAdminWidget
            leaveDays={leavesDays?.leaveNumber}
            leaves={leavesAll.data}
            managersLeaves={managersLeaves}
            companyId={companyId}
          />
        </div>
      )
    } catch (error) {
      console.log(error)
    }
  }
  //\\\\\\\\\\\\\\\\\\\\  MANAGER  ///////////\\\\\\\\\\\\\\\/\/\\//\/\\/\/\//\/\//\/\\/\/\//\/\\/\/\//\\/\/

  if (role === "manager") {
    try {
      const leaves = await prisma.leave.findMany({
        where: {
          companyId,
          departmentId
        }
      })

      return (
        <div>
          <LeaveManagerWidget
            remaingDays={remaingDays.remainingLeave}
            id={userId}
            leaves={leaves}
            departmentId={departmentId ? departmentId : ""}
          />
        </div>
      )
    } catch (error) {}
  }

  const leaves = await getLeavesByUser({ userId: user.id, companyId })
  return (
    <Suspense
      fallback={
        <div className="w-full h-full grid place-items-center">
          <Loader />
        </div>
      }
    >
      <LeaveUserWidget
        remaingDays={remaingDays.remainingLeave}
        leaves={leaves.data}
        leavesAll={leavesAll.data}
        departmentID={departmentId ? departmentId : ""}
      />
    </Suspense>
  )
}

export default LeavesPage
