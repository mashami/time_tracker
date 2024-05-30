"use client"

import { AnnouncementCop } from "@/components/Announcement"
import { AnnouncementDialog } from "@/components/AnnouncementDialog"
import { pusherClient } from "@/lib/pusher"
import { Announcement, Role } from "@prisma/client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
interface AnnouncementsWidgetProps {
  announcements: Announcement[]
  departmentID?: string | null
  role: Role
}

const AnnouncementsWidget = ({
  announcements,
  departmentID,
  role
}: AnnouncementsWidgetProps) => {
  const [oncomingAnnoucement, setOncomingAnnoucement] = useState<
    Announcement[]
  >([])

  useEffect(() => {
    const handleIncomingAnnoucement = (Annoucement: Announcement) => {
      setOncomingAnnoucement((prev) => [...prev, Annoucement])
    }

    pusherClient.subscribe(departmentID || "")
    pusherClient.bind("incoming-annoucement", handleIncomingAnnoucement)

    return () => {
      pusherClient.unbind("incoming-annoucement", handleIncomingAnnoucement)
      pusherClient.unsubscribe(departmentID || "")
    }
  }, [departmentID])

  const announcementLength = announcements.length

  return (
    <motion.section
      initial={{ y: "-10%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="mx-[85.5px] p-6 bg-[#F9F9F9] rounded-[32px] space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-medium leading-5 text-[24px] font-ibm_plex_mono">
          Announcements
        </h1>
        {(role === "Admin" || role === "manager") && (
          <AnnouncementDialog departmentId={departmentID} role={role} />
        )}
      </div>
      <div className="w-full p-4 rounded-[24px] bg-white space-y-6">
        <h2 className="font-medium leading-5 text-[16px] font-ibm_plex_mono">
          All {announcementLength}
        </h2>
        <div className="space-y-6">
          {oncomingAnnoucement.map((ann) => (
            <AnnouncementCop
              key={ann.id}
              id={ann.id}
              date={ann.updatedAt}
              description={ann.description}
              owner={ann.owner}
              role={role}
            />
          ))}

          {announcements.length > 0 ? (
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
    </motion.section>
  )
}

export default AnnouncementsWidget
