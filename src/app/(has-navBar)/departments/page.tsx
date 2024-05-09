import { Loader } from "@/components/Loader"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { Role } from "@prisma/client"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import DepartmentWidget from "./DepartmentWidget"

const DepartmentPage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/signin")
  }

  const companyId = user.companyId
  const role = user.role as Role

  const departments = await prisma.department.findMany({
    where: {
      companyId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if (role === "Admin") {
    return (
      <Suspense
        fallback={
          <div className="w-full h-full grid place-items-center">
            <Loader />
          </div>
        }
      >
        <DepartmentWidget companyId={companyId} departments={departments} />
      </Suspense>
    )
  } else {
    return signOut({ callbackUrl: "/signin" })
  }
}

export default DepartmentPage
