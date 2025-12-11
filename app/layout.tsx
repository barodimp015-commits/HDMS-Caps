import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { AuthProvider } from "@/components/Auth/auth-provider"
import "./globals.css"
import { Toaster } from "sonner"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "MSU Herbarium Data Management System",
  description: "Digitizing plant specimens for research, conservation, and education",
    icons: [
    { rel: "icon", url: "/logo/logo.png", sizes: "64x64" },
    { rel: "apple-touch-icon", url: "/logo/logo-180.png", sizes: "180x180" },
  ],

}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-dm-sans">
        <AuthProvider>
          {children}
           <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
