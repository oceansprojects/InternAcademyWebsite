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

export const metadata: Metadata = {
  title: {
    default: "InternAcademy",
    template: "%s | InternAcademy",
  },
  description:
    "InternAcademy helps students build job-ready tech skills through guided mentorship, portfolio projects, and career-focused learning programs.",
  applicationName: "InternAcademy",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "InternAcademy",
    description:
      "InternAcademy helps students build job-ready tech skills through guided mentorship, portfolio projects, and career-focused learning programs.",
    siteName: "InternAcademy",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "InternAcademy logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InternAcademy",
    description:
      "InternAcademy helps students build job-ready tech skills through guided mentorship, portfolio projects, and career-focused learning programs.",
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