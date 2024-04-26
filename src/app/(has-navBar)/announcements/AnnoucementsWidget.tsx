"use client"

import { AnnouncementCop } from "@/components/Announcement"
import { AnnouncementDialog } from "@/components/AnnouncementDialog"
import { Announcement, Role } from "@prisma/client"

interface AnnouncementsWidgetProps {
  announcements: Announcement[]
  companyId: string
  role: Role
}

const AnnouncementsWidget = ({
  announcements,
  companyId,
  role
}: AnnouncementsWidgetProps) => {
  const announcementLength = announcements.length

  return (
    <section className="w-full p-6 bg-[#F9F9F9] rounded-[32px] space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Announcements
        </h1>
        {role === "Admin" && <AnnouncementDialog companyId={companyId} />}
      </div>
      <div className="w-full p-4 rounded-[24px] bg-white space-y-6">
        <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
          All {announcementLength}
        </h2>
        <div className="space-y-6">
          {announcements.length - 1 > 0 ? (
            announcements.map((ann) => (
              <AnnouncementCop
                key={ann.id}
                id={ann.id}
                date={ann.updatedAt}
                description={ann.description}
                owner={ann.owner}
                role={role}
              />
            ))
          ) : (
            <p className="font-medium font-bricolage text-center">
              No Announcements yet
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementsWidget
