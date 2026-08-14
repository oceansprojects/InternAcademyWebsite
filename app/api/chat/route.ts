import { NextResponse } from "next/server"
import { OpenRouter } from "@openrouter/sdk"

import {
  buildInternBotPrompt,
  findRelevantPrograms,
  getFallbackAnswer,
  getWebsiteKnowledge,
} from "@/lib/internbot"

const MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "inclusionai/ling-3.0-tiny:free"
]

type StreamResult = {
  answer: string
  reasoningTokens?: number
}

function getSafeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown OpenRouter error"
}

async function collectOpenRouterStream(
  openRouter: OpenRouter,
  model: string,
  prompt: ReturnType<typeof buildInternBotPrompt>
): Promise<StreamResult> {
  const stream = await openRouter.chat.send({
    chatRequest: {
      model,
      messages: prompt,
      stream: true,
      temperature: 0.4,
      provider: {
        allowFallbacks: true,
      },
    },
  })

  let answer = ""
  let reasoningTokens: number | undefined

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) answer += content

    if (chunk.usage?.completionTokensDetails?.reasoningTokens !== undefined) {
      reasoningTokens = chunk.usage.completionTokensDetails.reasoningTokens
    }
  }

  return {
    answer: answer.trim(),
    ...(reasoningTokens === undefined ? {} : { reasoningTokens }),
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = typeof body?.message === "string" ? body.message.trim() : ""

    if (!message) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please enter a message.",
        },
        { status: 400 }
      )
    }

    const knowledge = await getWebsiteKnowledge()
    const relevantPrograms = findRelevantPrograms(message, knowledge.programs)
    const context = relevantPrograms.length
      ? relevantPrograms
          .map(
            (program) =>
              `- ${program.title} (${program.category}) | ${program.duration_weeks} weeks | ${program.batch_mode} | ${program.location} | ₹${program.discounted_price || program.base_price} | ${program.is_popular ? "Popular" : "Standard"}`
          )
          .join("\n")
      : knowledge.context
    const prompt = buildInternBotPrompt(message, context)

    const openRouterKey =
      process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY

    if (!openRouterKey) {
      return NextResponse.json({
        ok: true,
        answer:
          getFallbackAnswer(message, knowledge.context) ||
          "I'm not able to help with that beyond InternAcademy website topics.",
        source: "local",
      })
    }

    const openRouter = new OpenRouter({
      apiKey: openRouterKey,
    })

    let result: StreamResult | null = null

    for (const model of MODELS) {
      try {
        result = await collectOpenRouterStream(openRouter, model, prompt)
        if (result.answer) break
      } catch (modelError) {
        console.warn(
          `OpenRouter model '${model}' unavailable; trying next backup:`,
          getSafeErrorMessage(modelError)
        )
      }
    }

    const cleanAnswer = result?.answer || ""

    if (!cleanAnswer) {
      return NextResponse.json(
        {
          ok: true,
          answer: getFallbackAnswer(message, knowledge.context),
          source: "local",
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ok: true,
      answer: cleanAnswer,
      source: "openrouter",
      ...(result.reasoningTokens === undefined
        ? {}
        : { reasoningTokens: result.reasoningTokens }),
    })
  } catch (error) {
    console.error("Chat API error:", getSafeErrorMessage(error))
    return NextResponse.json(
      {
        ok: true,
        answer:
          "I’m not able to answer that beyond InternAcademy website topics right now. Please ask me about courses, internships, fees, admissions, or support.",
        source: "local",
      },
      { status: 200 }
    )
  }
}
