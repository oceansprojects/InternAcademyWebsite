import Razorpay from "razorpay"

let instance: Razorpay | null = null

export function getRazorpay(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return instance
}

export const razorpayKeyId = process.env.RAZORPAY_KEY_ID ?? ""
export const isPaymentsConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
)
