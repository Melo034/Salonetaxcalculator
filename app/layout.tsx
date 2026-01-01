import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Modern typography - Inter for body, Outfit for headings
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Sierra Leone Tax Guide | Free Tax Calculators - Know Your Rights",
  description:
    "Free tax calculators for Sierra Leone. Calculate PAYE, NASSIT, End of Service benefits, GST, Withholding Tax, Rent Tax, Import Tax, and Capital Gains Tax. Based on Finance Acts 2024-2025. Know your rights and protect yourself from being cheated.",
  keywords: [
    "Sierra Leone tax calculator",
    "PAYE calculator Sierra Leone",
    "NASSIT calculator",
    "end of service benefits SL",
    "EOS calculator Sierra Leone",
    "rent tax calculator",
    "import tax calculator",
    "capital gains tax SL",
    "GST calculator Sierra Leone",
    "withholding tax calculator",
    "NRA tax Sierra Leone",
    "Income Tax Act 2000",
    "Finance Act 2024",
    "Finance Act 2025",
    "tax education Sierra Leone",
    "Sierra Leone financial laws",
    "National Revenue Authority",
  ],
  authors: [{ name: "SL Tax Guide" }],
  creator: "SL Tax Guide",
  publisher: "SL Tax Guide",
  openGraph: {
    title: "Sierra Leone Tax Guide | Free Tax Calculators - Know Your Rights",
    description:
      "Free tax calculators for Sierra Leone. PAYE, NASSIT, EOS, GST, Withholding, Rent, Import & Capital Gains Tax. Based on Finance Acts 2024-2025. Know your rights - don't get cheated!",
    type: "website",
    locale: "en_SL",
    siteName: "Sierra Leone Tax Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sierra Leone Tax Guide | Free Tax Calculators",
    description: "Calculate your taxes accurately with our free calculators. Based on Finance Acts 2024-2025.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "Next.js",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#313B2F" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2019" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background">
        {/* Main Content */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
