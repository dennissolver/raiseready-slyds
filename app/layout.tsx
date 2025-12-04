import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"

// Poppins for headings - modern, confident feel
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Inter for body text - clean readability
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SlydS | AI Pitch Coaching",
  description: "Want to be the next UNICORN? Become a STORYTELLER. AI-powered pitch coaching from India's leading fundraising advisory.",
  keywords: ["pitch deck", "fundraising", "startup", "investor", "India", "storytelling", "SlydS"],
  authors: [{ name: "SlydS", url: "https://slyds.com" }],
  creator: "SlydS - Decks, Fundraise & Strategy",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pitch.slyds.com",
    siteName: "SlydS Pitch Portal",
    title: "SlydS | AI Pitch Coaching",
    description: "AI-powered pitch coaching from the team that has raised $2B+ for 500+ startups",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SlydS | AI Pitch Coaching",
    description: "Become a STORYTELLER. Raise with confidence.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}