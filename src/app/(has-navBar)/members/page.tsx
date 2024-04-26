import { Loader } from "@/components/Loader"
import { authOptions } from "@/lib/auth"
import { getAllInvitedUSers, getAllUserAsignCompany } from "@/services/user"
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
  // console.log(companyId)

  // console.log(allUsers)

  const invitedUser = await getAllInvitedUSers(companyId)

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
        invitations={invitedUser.data}
      />
    </Suspense>
  )
}

export default Memberspage
