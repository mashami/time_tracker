import { Loader } from "@/components/Loader"
import { authOptions } from "@/lib/auth"
import { getAnnouncementCompany, getLeavesByUser } from "@/services/user"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import DashboardUserWidgetPage from "./DashboardUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>

const DashboardPage = async () => {
  //Instead of using session again while I have context holds a user who is sign in  I will be using a context API later

  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }

  const companyId = session?.user.companyId
  const role = session?.user.role
  const userId = session?.user.id

  const announcements = await getAnnouncementCompany(companyId)

  if (role === "Admin") {
    return redirect("/members")
  } else if (role === "Staff") {
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
  } else {
    return redirect("/signin")
  }
}

export default DashboardPage
