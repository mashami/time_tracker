import { Loader } from "@/components/Loader"
import { getAnnouncements } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import AnnouncementsWidget from "./AnnoucementsWidget"

const Announcementpage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/signin")
  }

  const departmentID = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      departmentId: true
    }
  })

  const departmentId = departmentID?.departmentId as any

  const companyId = user.companyId
  const role = user.role as Role

  const announcements = await getAnnouncements(role, companyId, departmentId)

  return (
    <Suspense
      fallback={
        <div className="w-full h-full grid place-items-center">
          <Loader />
        </div>
      }
    >
      <AnnouncementsWidget
        announcements={announcements}
        departmentID={departmentId}
        role={role}
      />
    </Suspense>
  )
}

export default Announcementpage
