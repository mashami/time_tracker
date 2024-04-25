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

const DashboardPage = async () => {
  //Instead of using session again while I have context holds a user who is sign in  I will be using a context API later

  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }

  const userId = session?.user.id

  const data = await getUser(userId)
  const user = data?.user as UserWithRelations

  const companyId = user.companyId

  const announcements = await getAnnouncementCompany(companyId)

  if (user.role === "Admin") {
    const allUsers = await getAllUserAsignCompany(companyId)
    // console.log(allUsers.data)

    const invitedUser = await getAllInvitedUSers(companyId)

    return (
      <>
        <DashboardAdminPageWidget
          companyId={companyId}
          users={allUsers.data}
          invitations={invitedUser.data}
          announcements={announcements.data}
        />
      </>
    )
  } else if (user.role === "Staff") {
    const leaves = await getLeavesByUser({
      userId: user.id,
      companyId: user.companyId
    })
    return (
      <>
        <DashboardUserWidgetPage
          companyId={companyId}
          userId={userId}
          leaves={leaves.data}
          user={user}
          announcements={announcements.data}
        />
      </>
    )
  } else {
    return redirect("/signin")
  }
}

export default DashboardPage
