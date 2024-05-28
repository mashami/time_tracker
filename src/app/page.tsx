"use client"
import { HomePageDescription } from "@/components/HomePageDescription"
import {
  AlarmSvg,
  AlarmUserSvg,
  ArrowRighSvg,
  ClockUserSvg
} from "@/components/Svg"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
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

          <motion.svg
            width={69}
            height={98}
            viewBox="0 0 69 98"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-2 left-40"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut"
              }}
              d="M46.03 2C42.53 3.16667 35.63 9.7 36.03 26.5C36.53 47.5 44.03 50.5 46.53 50.5C49.03 50.5 54.03 43.5 34.03 30C14.03 16.5 -1 26.5 2.02998 42C5.00986 57.2437 25.03 82 66.53 88.5M66.53 88.5L59.0302 76.5M66.53 88.5L52.5302 96.5"
              stroke="#006A86"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </motion.svg>
        </div>
        <div className="grid grid-cols-3 gap-9 relative">
          <motion.div
            initial={{ x: "222%"}}
            whileInView={{ x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
            
          >
            <HomePageDescription
              svg={<AlarmSvg />}
              header="Request for leave"
              description="Enter your basic details including name, and position. Choose the type of leave you need – be it annual, sick, or any other category."
            />
          </motion.div>

          <motion.div
            initial={{ x: "111%" }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
            
          >
            <HomePageDescription
              svg={<ClockUserSvg />}
              header="Track your Shift"
              description="With our convenient shift tracking feature. Input your schedule details, including shift start and end times, as well as any breaks or overtime."
            />
          </motion.div>
          <motion.div
            initial={{ x: "1%" }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <HomePageDescription
              svg={<AlarmUserSvg />}
              header="Check your Break time"
              description="Take control of your break time with our handy break tracking feature. Simply log your break start and end times."
            />
          </motion.div>
        </div>
      </div>

      <motion.svg
        width={577}
        height={333}
        viewBox="0 0 577 333"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.25,
            ease: "easeInOut"
          }}
          d="M0 3C100.339 90.0591 278.294 275.392 187.398 320.249C73.7789 376.321 -94.437 160.887 574 225.812"
          stroke="url(#paint0_linear_141_4588)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_141_4588"
            x1={287}
            y1="132.5"
            x2={287}
            y2="329.665"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8E38FF" />
            <stop offset={1} stopColor="#992B87" />
          </linearGradient>
        </defs>
      </motion.svg>
    </main>
  )
}
