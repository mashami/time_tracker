import {
  getAllInvitedUSers,
  getAllUserAsignCompany,
  getLeaves,
  getLeavesByUser,
  getUser
} from "@/services/user"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import DashboardAdminPageWidget from "./DashboardAdmin_widget"
import DashboardUserWidgetPage from "./DashboardUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>
const dashboardPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }
  const userId = session?.user?.id as string

  try {
    const data = await getUser(userId)
    const user = data?.user as UserWithRelations

    const companyId = user.companyId

    if (user.role === "Admin") {
      const leaves = await getLeaves(companyId)
      const allUsers = await getAllUserAsignCompany(companyId)
      const invitedUser = await getAllInvitedUSers(companyId)
      return (
        <div>
          <DashboardAdminPageWidget
            companyId={companyId}
            leaves={leaves.data}
            users={allUsers.data}
            invitations={invitedUser.data}
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
          />
        </div>
      )
    } else {
      return redirect("/signin")
    }
  } catch (error) {
    console.log(error)
  }
}

export default dashboardPage
