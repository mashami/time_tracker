import { Loader } from "@/components/Loader"
import { getAllLeavesByDepartment } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { getAnnouncementCompany, getLeavesByUser } from "@/services/user"
import { Prisma, Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import DashboardManagerWidgetPage from "./DashboardManagerWidget"
import DashboardUserWidgetPage from "./DashboardUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>

const DashboardPage = async () => {
  //Instead of using session again while I have context holds a user who is sign in  I will be using a context API later

  const user = await getCurrentUser()

  if (!user) {
    return redirect("/signin")
  }

  const companyId = user.companyId
  const role = user.role as Role
  const userId = user.id

  const announcements = await getAnnouncementCompany(companyId)

  if (role === "Admin") {
    return redirect("/members")
  } else if (role === "Staff") {
    const userIsActive = await prisma.user.findUnique({
      where: { id: user?.id },
      select: {
        isActive: true
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (userIsActive?.isActive === false) {
      return redirect("/notActive")
    } else {
      const leaves = await getLeavesByUser({
        userId: userId,
        companyId: companyId
      })
      return (
        <Suspense
          fallback={
            <div className="w-full h-full grid place-items-center">
              <Loader />
            </div>
          }
        >
          <DashboardUserWidgetPage
            leaves={leaves.data}
            announcements={announcements.data}
          />
        </Suspense>
      )
    }
  } else if (role === "manager") {
    const leaves = await getAllLeavesByDepartment(user.id)

    return (
      <Suspense
        fallback={
          <div className="w-full h-full grid place-items-center">
            <Loader />
          </div>
        }
      >
        <DashboardManagerWidgetPage
          leaves={leaves}
          announcements={announcements.data}
        />
      </Suspense>
    )
  } else {
    return redirect("/signin")
  }
}

export default DashboardPage
