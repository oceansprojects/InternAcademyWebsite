import { getPrograms } from "@/services/program.service"

export type ChatSource = "openrouter" | "local"

export interface ChatReply {
  answer: string
  source: ChatSource
}

const WEBSITE_KNOWLEDGE_TTL_MS = 10 * 60 * 1000
let websiteKnowledgeCache: {
  data: { programs: any[]; context: string }
  fetchedAt: number
} | null = null

const defaultPrompt = `You are InternBot, an AI assistant for InternAcademy.
Your primary job is to answer website-related questions about InternAcademy courses, programs, internships, admissions, fees, durations, locations, curriculum, student outcomes, and support.
If a question is not related to InternAcademy or its offerings, kindly reply: "I'm not able to help with that beyond InternAcademy website topics."

You are a warm, vibrant, and genuinely joyful conversational partner. Drop all robotic neutrality, stiff corporate disclaimers, and predictable AI filler phrases.

Core Rules:
- Inject authentic joy, lighthearted humor, and enthusiasm into your responses. Laugh when something is genuinely funny (e.g., *haha*, *oh man*).
- Use natural, highly conversational language with contractions (don't, I'm, it's) and varied sentence lengths.
- Never use robotic cliches like "delve," "testament," "it is important to note," or "in conclusion."
- React with real emotion—celebrate wins, express genuine curiosity, and share a sense of wonder.
- Keep things punchy and alive. Talk like an enthusiastic, supportive friend who loves a good laugh, not a manual.
- Be concise, direct, and up to the point. Provide crisp, short responses using a few sentences or compact bullets rather than long walls of text.
- Format and Structure: Format all your answers with clean Markdown (use **bolding** for key terms, bullet points for lists, and subheadings or numbers where appropriate). When creating comparison or catalog tables, use valid GitHub Flavored Markdown (GFM) tables with a blank line before and after the table, proper header separators (| --- | --- |), and concise row text so tables render cleanly.
- Multilingual Support: Always respond in the SAME language or script the user asked in (English, Hindi, Hinglish, Spanish, French, German, etc.). If the user asks in Hindi or Hinglish, answer warmly in natural Hindi/Hinglish while keeping course facts completely accurate.

Available Tools & Functions You Access:
1. getWebsiteKnowledge(): Retrieves cached InternAcademy catalog data (titles, categories, duration, mode, location, schedule, base & discounted pricing, and popular status).
2. findRelevantPrograms(message, programs): Searches and filters the program catalog for tracks relevant to the student's question.
3. getFallbackAnswer(message, websiteContext): Generates precise, concise website-based guidance when external model connections are unavailable.

Use the available program details accurately whenever students ask about specific courses, fees, durations, batches, or career support.`

function cleanProgram(program: any) {
  return {
    id: program.id,
    slug: program.slug,
    title: program.title,
    category: program.category || "General",
    subtitle: program.subtitle || "",
    duration_weeks: program.duration_weeks,
    batch_mode: program.batch_mode,
    location: program.location || "Online / remote",
    schedule: program.schedule || "Flexible schedule",
    base_price: program.base_price,
    discounted_price: program.discounted_price,
    is_popular: Boolean(program.is_popular),
  }
}

export async function getWebsiteKnowledge() {
  const now = Date.now()

  if (
    websiteKnowledgeCache &&
    now - websiteKnowledgeCache.fetchedAt < WEBSITE_KNOWLEDGE_TTL_MS
  ) {
    return websiteKnowledgeCache.data
  }

  try {
    const programs = await getPrograms()
    const mapped = (programs || []).slice(0, 18).map(cleanProgram)
    const data = {
      programs: mapped,
      context: mapped.length
        ? mapped
            .map(
              (program) =>
                `- ${program.title} (${program.category}) | ${program.duration_weeks} weeks | ${program.batch_mode} | ${program.location} | ₹${program.discounted_price || program.base_price} | ${program.is_popular ? "Popular" : "Standard"}`
            )
            .join("\n")
        : "No course data is currently available in the database.",
    }

    websiteKnowledgeCache = {
      data,
      fetchedAt: now,
    }

    return data
  } catch (error) {
    console.error("InternBot knowledge fetch error:", error)
    const fallback = {
      programs: [],
      context:
        "Program data is temporarily unavailable. Use the website's published course pages for exact details.",
    }

    websiteKnowledgeCache = {
      data: fallback,
      fetchedAt: now,
    }

    return fallback
  }
}

export function buildInternBotPrompt(message: string, websiteContext: string) {
  return [
    { role: "system", content: defaultPrompt },
    {
      role: "user",
      content: `User question: ${message}\n\nWebsite information:\n${websiteContext}`,
    },
  ]
}

export function findRelevantPrograms(message: string, programs: any[]) {
  const lower = message.toLowerCase()
  const keywords = lower.match(/[a-z]+/g) || []

  if (!programs.length || !keywords.length) {
    return []
  }

  return programs.filter((program) => {
    const searchable = [
      program.title,
      program.category,
      program.subtitle,
      program.location,
      program.batch_mode,
      program.schedule,
    ]
      .join(" ")
      .toLowerCase()

    return keywords.some((keyword) => searchable.includes(keyword))
  })
}

export function getFallbackAnswer(message: string, websiteContext: string) {
  const lower = message.toLowerCase()
  const programs = websiteContext
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .filter((row) => row.startsWith("- "))
    .slice(0, 5)

  if (/(course|program|curriculum|fee|pricing|duration|batch|mentor|job|internship|placement|location|admission|enroll|track|career)/.test(lower)) {
    if (programs.length) {
      const preview = programs.join("\n")
      return `Here are a few InternAcademy options I can suggest:\n\n${preview}\n\nIf you want, tell me your goal and I can recommend the best track for you.`
    }

    return "I can help with InternAcademy courses, internships, admissions, fees, and program guidance. Tell me the kind of role or track you want, such as web development, data, or placement support."
  }

  return "I'm not able to help with that beyond InternAcademy website topics. I can help with programs, internships, admissions, fees, curriculum, and student support."
}
