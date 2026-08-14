import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_DATABASE_URL || "")

/** True when a database connection string is configured. */
export const hasDatabase = Boolean(process.env.NEON_DATABASE_URL)
