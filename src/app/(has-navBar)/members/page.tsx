import { Loader } from "@/components/Loader"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAllUserAsignCompany } from "@/services/user"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import MembersWidget from "./MembersWidget"

const Memberspage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }

  const companyId = session?.user.companyId
  const role = session?.user.role
  const userId = session?.user.id
  const allUsers = await getAllUserAsignCompany(companyId)

  const userRequests = await prisma.user.findMany({
    where: { isActive: false, companyId },
    select: {
      name: true,
      departmentId: true,
      id: true,
      departmentName: true,
      updatedAt: true
    }
  })

  // const invitedUser = await getAllInvitedUSers(companyId)

  return (
    <Suspense
      fallback={
        <div className="w-full h-full grid place-items-center">
          <Loader />
        </div>
      }
    >
      <MembersWidget
        users={allUsers.data}
        companyId={companyId}
        userRequests={userRequests}
      />
    </Suspense>
  )
}

export default Memberspage
