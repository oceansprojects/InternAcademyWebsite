// Lightweight email sender backed by Resend's REST API.
// No-ops gracefully (logs to console) when RESEND_API_KEY is not configured.

type SendArgs = {
  to: string
  subject: string
  html: string
  text?: string
}

export type SendResult = {
  success: boolean
  error?: string
}

const DEFAULT_FROM = process.env.EMAIL_FROM ?? "Intern Academy <onboarding@resend.dev>"

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log("[v0] email skipped (no RESEND_API_KEY):", { to, subject })
    return { success: true }
  }
  try {
    let senderFrom = DEFAULT_FROM
    let payload: Record<string, any> = { from: senderFrom, to, subject, html }
    if (text) {
      payload.text = text
    }

    let res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    // If custom domain is unverified, fallback to onboarding@resend.dev
    if (!res.ok) {
      const errText = await res.text()
      if (errText.includes("domain is not verified") && senderFrom !== "Intern Academy <onboarding@resend.dev>") {
        console.log("[Email] Retrying with onboarding@resend.dev...")
        payload.from = "Intern Academy <onboarding@resend.dev>"
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const finalErr = await res.text().catch(() => errText)
        console.error("[Email send failed]:", finalErr)
        return { success: false, error: finalErr }
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("[v0] email send error:", err)
    return { success: false, error: err?.message || String(err) }
  }
}
