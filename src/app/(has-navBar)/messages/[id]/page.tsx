import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import MessageWidget from "./MessageWidget"

interface PageProps {
  params: {
    id: string
  }
}

const Messagepage = async ({ params }: PageProps) => {
  const { id } = params
  const user = await getCurrentUser()
  const name = user?.name

  const messages = await prisma.message.findMany({
    where: { departmentId: id },
    orderBy: { createdAt: "asc" }
  })

  return (
    <div>
      <MessageWidget departmentId={id} messages={messages} name={name} />
    </div>
  )
}

export default Messagepage
