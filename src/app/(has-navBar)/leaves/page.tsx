import { authOptions } from "@/lib/auth"
import { getLeaves, getLeavesByUser, getUser } from "@/services/user"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import LeaveAdminWidget from "./LeaveAdminWidget"
import LeaveUserWidget from "./LeaveUserWidget"

export type UserWithRelations = Prisma.UserGetPayload<{}>

const LeavesPage = async () => {
  //Instead of using session again while I have context holds a user who is sign in  I will be using a context API later

  const session = await getServerSession(authOptions)
  if (!session) {
    return redirect("/signin")
  }
  const userId = session?.user?.id as string
  const data = await getUser(userId)
  const user = data?.user as UserWithRelations
  const companyId = user.companyId

  const leavesAll = await getLeaves(companyId)

  if (user.role === "Admin") {
    try {
      const data = await getUser(userId)
      const user = data?.user as UserWithRelations

      return (
        <div>
          <LeaveAdminWidget leaves={leavesAll.data} />
        </div>
      )
    } catch (error) {
      console.log(error)
    }
  }
  const leaves = await getLeavesByUser({ userId: user.id, companyId })
  return (
    <div>
      <LeaveUserWidget
        user={user}
        leaves={leaves.data}
        companyId={companyId}
        leavesAll={leavesAll.data}
      />
    </div>
  )
}

export default LeavesPage
