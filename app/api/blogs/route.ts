import { NextResponse } from "next/server"

import { getBlogArticles } from "@/lib/blog-feed"

export async function GET() {
  try {
    const articles = await getBlogArticles()
    const isFallback = articles.every(
      (article) => article.source.name === "InternAcademy"
    )

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": isFallback
          ? "no-store"
          : "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400",
        "x-blog-source": isFallback ? "fallback" : "rss-cache",
      },
    })
  } catch (error) {
    console.error("Blog API Error:", error)

    return NextResponse.json([], {
      status: 500,
    })
  }
}