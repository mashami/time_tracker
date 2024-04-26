import { Loader } from "@/components/Loader"
import { authOptions } from "@/lib/auth"
import { getAnnouncementCompany } from "@/services/user"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import AnnouncementsWidget from "./AnnoucementsWidget"

const Announcementpage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/signin")
  }

  const companyId = session?.user.companyId
  const role = session?.user.role as Role

  const announcements = await getAnnouncementCompany(companyId)

  return (
    <Suspense
      fallback={
        <div className="w-full h-full grid place-items-center">
          <Loader />
        </div>
      }
    >
      <AnnouncementsWidget
        announcements={announcements.data}
        companyId={companyId}
        role={role}
      />
    </Suspense>
  )
}

export default Announcementpage
