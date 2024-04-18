import { getInvitation } from "@/services/user"
import { Prisma } from "@prisma/client"
import WidgetSignUpPage from "../Widget"

interface invitePageProps {
  params: {
    invitationId: string
  }
}
export type UserWithRelations = Prisma.UserGetPayload<{}>

const invitePage = async ({ params: { invitationId } }: invitePageProps) => {
  const invitationData = await getInvitation(invitationId)

  if (!invitationData.error) {
    return (
      <div>
        <h1>Welcome Staff </h1>
        <WidgetSignUpPage invitation={invitationData.data} />
      </div>
    )
  }
  return (
    <div>
      <h1>Error to find the invitation</h1>
    </div>
  )
}

export default invitePage
