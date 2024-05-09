import { getInvitation } from "@/services/user"
import { Invitation, Prisma } from "@prisma/client"
import WidgetSignUpPage from "../Widget"

interface invitePageProps {
  params: {
    invitationId: string
  }
}
export type UserWithRelations = Prisma.UserGetPayload<{}>

const invitePage = async ({ params: { invitationId } }: invitePageProps) => {
  const resultFech = await getInvitation(invitationId)

  const invitation = resultFech.data as Invitation

  // console.log(invitation)

  if (!resultFech.error && invitation.isActive) {
    return (
      <div>
        <WidgetSignUpPage invitation={invitation} />
      </div>
    )
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1 className="font-bold text-[32px] font-bricolage leading-6 uppercase">
        This invitation link has expired
      </h1>
    </div>
  )
}

export default invitePage
