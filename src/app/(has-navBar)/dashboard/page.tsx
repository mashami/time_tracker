import { authOptions } from "@/lib/auth"
import {
  getAllInvitedUSers,
  getAllUserAsignCompany,
  getAnnouncementCompany,
  getLeavesByUser,
  getUser
} from "@/services/user"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import DashboardAdminPageWidget from "./DashboardAdmin_widget"
import DashboardUserWidgetPage from "./DashboardUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>

const dashboardPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }
  const userId = session?.user.id

  try {
    const data = await getUser(userId)
    const user = data?.user as UserWithRelations

    const companyId = user.companyId
    const announcements = await getAnnouncementCompany(companyId)

    if (user.role === "Admin") {
      const allUsers = await getAllUserAsignCompany(companyId)
      // console.log(allUsers.data)

      const invitedUser = await getAllInvitedUSers(companyId)

      return (
        <div>
          <DashboardAdminPageWidget
            companyId={companyId}
            users={allUsers.data}
            invitations={invitedUser.data}
            announcements={announcements.data}
          />
        </div>
      )
    } else if (user.role === "Staff") {
      const leaves = await getLeavesByUser({
        userId: user.id,
        companyId: user.companyId
      })
      return (
        <div>
          <DashboardUserWidgetPage
            companyId={companyId}
            userId={userId}
            leaves={leaves.data}
            user={user}
            announcements={announcements.data}
          />
        </div>
      )
    } else {
      return redirect("/signin")
    }
  } catch (error) {
    return redirect("/signin")
  }
}

export default dashboardPage
