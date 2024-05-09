import Link from "next/link"

const NotActiveUserPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="font-bold text-[32px] font-bricolage leading-6 uppercase">
          Wait for Approvel from Admin
        </h1>
        <Link href={"/dashboard"}>Try again</Link>
      </div>
    </div>
  )
}

export default NotActiveUserPage
