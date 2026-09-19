import SiteHeader from "@/components/site-header";
import { Hero } from "@/components/hero"
import { MarqueeBar } from "@/components/marquee-bar"
import { Programs } from "@/components/programs"
import { HowItWorks } from "@/components/how-it-works"
import { OurGoal } from "@/components/our-goal"
import { TrustedPartners } from "@/components/trusted-partners"
import { TestimonialsSection } from "@/components/testimonials-section"
import { InternBotCta } from "@/components/internbot-cta"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"
import { InternBotWidget } from "@/components/internbot-widget"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <MarqueeBar />
        <Programs />
        <HowItWorks />
        <OurGoal />
        <TrustedPartners />
        <TestimonialsSection />
        <InternBotCta />
        <FinalCta />
      </main>
      <SiteFooter />
      <InternBotWidget />
    </div>
  )
}
