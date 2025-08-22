import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm-sans",
})

export const metadata: Metadata = {
    title: "DocuHub - Document Management for Teams",
    description: "Organize, access, and manage your team's Google Docs documents effortlessly",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${dmSans.variable} antialiased`}>
        <body className="font-sans">{children}</body>
        </html>
    )
}
