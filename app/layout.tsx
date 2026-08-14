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