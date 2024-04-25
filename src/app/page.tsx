"use client"
import { HomePageDescription } from "@/components/HomePageDescription"
import {
  AlarmSvg,
  AlarmUserSvg,
  AnimationLineDownSvg,
  AnimationLineUpSvg,
  ArrowRighSvg,
  ClockUserSvg
} from "@/components/Svg"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// command to remove nodemodules:  rm -rf node_modules .next yarn.lock
export default function HomePage() {
  const router = useRouter()
  return (
    <main className="w-full h-full px-[100px] pt-[54px] pb-[172px] bg-[#F3F3F3] relative">
      <div className="flex items-center justify-between">
        <h1 className="font-bricolage font-bold text-[24px] text-[#006A86]">
          Time Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <Button
            text="Sign in"
            className="py-[14px] px-6 bg-white hover:bg-white/80 rounded-[32px]"
            onClick={() => router.push("/signin")}
          />
          <Button
            text="Create account"
            className="py-[14px] px-6 bg-black hover:bg-black/80 rounded-[32px] text-white"
            svg={<ArrowRighSvg />}
            onClick={() => router.push("/signup")}
          />
        </div>
      </div>
      <div className="max-w-[1059px] mx-auto pt-[71px] text-center space-y-[74px]">
        <div className="max-w-[692px] mx-auto px-4 relative">
          <p className="uppercase text-[14px] text-[#006A86] font-semibold leading-[21px]">
            the ultimate online leave management system.
          </p>
          <h1 className="text-[64px] text-black font-bold leading-[71px] font-bricolage pt-[10px] pb-5">
            Effortless Leave Management
          </h1>
          <p className="text-[20px] font-light leading-[30px] text-black pb-[44px]">
            Welcome to Smart leave, the ultimate online leave management system
            ensuring seamless vacation planning and tracking for your team.
          </p>
          <Button
            text="Create account"
            className="py-[14px] px-6 bg-black hover:bg-black/80 rounded-[32px] text-white"
            svg={<ArrowRighSvg />}
            onClick={() => router.push("/signup")}
          />

          <span className="absolute bottom-2 left-40">
            <AnimationLineUpSvg />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-9 relative">
          <HomePageDescription
            svg={<AlarmSvg />}
            header="Request for leave"
            description="Enter your basic details including name, and position. Choose the type of leave you need – be it annual, sick, or any other category."
          />

          <HomePageDescription
            svg={<ClockUserSvg />}
            header="Track your Shift"
            description="With our convenient shift tracking feature. Input your schedule details, including shift start and end times, as well as any breaks or overtime."
          />
          <HomePageDescription
            svg={<AlarmUserSvg />}
            header="Check your Break time"
            description="Take control of your break time with our handy break tracking feature. Simply log your break start and end times."
          />
        </div>
      </div>
      <span className="absolute bottom-0 left-0">
        <AnimationLineDownSvg />
      </span>
    </main>
  )
}
