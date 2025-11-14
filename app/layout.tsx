import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

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
  icons: {
    icon: "/logo/icon.png",               // default favicon
    apple: "/logo/icon.png",     // optional for iOS
    other: [
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-dm-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
