import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
})
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "AI Companion - Your Lifetime Journey Partner",
  description: "A compassionate AI companion for mental health support and personal growth",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${workSans.variable} ${openSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
