import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google"
import "../styles/globals.scss"

const inter = Inter({ subsets: ["latin"] })

const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["100", "200", "300", "500", "600", "700"]
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque"
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          ibm_plex_mono.variable,
          bricolage.variable
        )}
      >
        <div className="h-full">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
