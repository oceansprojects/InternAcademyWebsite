import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Geist_Mono,
  Montserrat,
} from "next/font/google";

import "./globals.css";

import { Providers } from "./providers";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "sonner";
import { getAppUrl } from "@/lib/env";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#004aad",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "InternAcademy | A Launchpad to Real-World Skills",
    template: "%s | InternAcademy",
  },
  description:
    "InternAcademy empowers students and graduates with hands-on offline tech cohorts in CSN, real-world portfolio projects, 1-on-1 industry mentorship, and verifiable certifications.",
  keywords: [
    "InternAcademy",
    "Intern Academy",
    "Tech Cohorts CSN",
    "Software Development Training",
    "Full Stack Web Development",
    "UI/UX Design Cohort",
    "Internships in CSN",
    "Offline Tech Academy",
  ],
  authors: [{ name: "InternAcademy" }],
  creator: "InternAcademy",
  publisher: "InternAcademy",
  applicationName: "InternAcademy",
  icons: {
    icon: [
      { url: "/images/logo-des.png", sizes: "any" },
      { url: "/images/logo-des.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo-des.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo-des.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/images/logo-des.png",
    apple: [
      { url: "/images/logo-des.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "InternAcademy | A Launchpad to Real-World Skills",
    description:
      "Build job-ready tech and design skills with CSN's premier offline training cohorts, practical projects, and guaranteed internship opportunities.",
    url: getAppUrl(),
    siteName: "InternAcademy",
    images: [
      {
        url: "/images/logo-des.png",
        width: 800,
        height: 800,
        alt: "InternAcademy Logo",
      },
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "InternAcademy Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InternAcademy | A Launchpad to Real-World Skills",
    description:
      "Build job-ready tech and design skills with CSN's premier offline training cohorts, practical projects, and guaranteed internship opportunities.",
    images: ["/logo-full.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`light ${jakarta.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${montserrat.variable} bg-background`}
    >
      <head>
        <link rel="icon" href="/images/logo-des.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo-des.png" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}

          <ScrollToTop />

          <Toaster richColors position="top-right" />

          <Analytics />
        </Providers>
      </body>
    </html>
  );
}