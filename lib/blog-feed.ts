import Parser from "rss-parser"
import { unstable_cache } from "next/cache"

export interface BlogArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
  category: string
}

interface FeedConfig {
  name: string
  url: string
  category: string
  fallbackImage: string
}

interface FeedItem {
  title?: string
  link?: string
  isoDate?: string
  pubDate?: string
  author?: string
  creator?: string
  content?: string
  contentSnippet?: string
  summary?: string
  enclosure?: {
    url?: string
  }
  "content:encoded"?: string
  "media:content"?:
    | {
        $?: {
          url?: string
        }
      }
    | Array<{
        $?: {
          url?: string
        }
      }>
  "media:thumbnail"?:
    | {
        $?: {
          url?: string
        }
      }
    | Array<{
        $?: {
          url?: string
        }
      }>
}

const REVALIDATE_SECONDS = 60 * 60 * 6

const parser = new Parser<Record<string, never>, FeedItem>({
  customFields: {
    item: ["content:encoded", "media:content", "media:thumbnail"],
  },
})

const feedSources: FeedConfig[] = [
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "Technology",
    fallbackImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Technology",
    fallbackImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "Technology",
    fallbackImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Google News Tech",
    url: "https://news.google.com/rss/search?q=technology%20software%20developer&hl=en-IN&gl=IN&ceid=IN:en",
    category: "Technology",
    fallbackImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Google News Business",
    url: "https://news.google.com/rss/search?q=business%20startup%20software&hl=en-IN&gl=IN&ceid=IN:en",
    category: "Business",
    fallbackImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
]

export const fallbackArticles: BlogArticle[] = [
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "How AI is changing entry-level software roles",
    description:
      "A practical look at how AI tools are reshaping junior developer workflows, hiring expectations, and day-to-day delivery.",
    url: "https://internacademy.in/blog/ai-changing-entry-level-software-roles",
    urlToImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-08-01T09:00:00.000Z",
    content:
      "## Summary\n\nAI-assisted coding is becoming standard across engineering teams. Junior developers now need stronger problem framing, review discipline, and product context alongside traditional coding skills.\n\n## Why it matters\n\nEmployers still value coding ability, but they increasingly look for engineers who can validate output, understand product impact, and move quickly with modern tooling.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "What recruiters expect from a modern frontend portfolio",
    description:
      "The strongest frontend portfolios now demonstrate shipping ability, performance awareness, and a clear understanding of product tradeoffs.",
    url: "https://internacademy.in/blog/modern-frontend-portfolio-guide",
    urlToImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-28T11:30:00.000Z",
    content:
      "## Summary\n\nRecruiters increasingly look for evidence of real-world execution: responsive interfaces, good accessibility, sensible state management, and deployed work they can inspect quickly.\n\n## What to show\n\nA strong portfolio highlights product thinking, clean implementation, and the ability to ship features that hold up under practical constraints.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "Cloud basics every student developer should know",
    description:
      "You do not need deep infrastructure expertise to stand out, but you should understand deployment, environments, logs, and managed services.",
    url: "https://internacademy.in/blog/cloud-basics-for-students",
    urlToImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-20T08:15:00.000Z",
    content:
      "## Summary\n\nA working understanding of hosting, environment variables, observability, and failure modes helps new developers contribute more effectively from their first project.\n\n## Practical value\n\nEven basic cloud fluency makes debugging easier and improves collaboration with senior engineers and DevOps workflows.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "TypeScript habits that reduce production bugs",
    description:
      "Small habits such as validating external data, narrowing unions, and removing implicit any usage make TypeScript pay off faster.",
    url: "https://internacademy.in/blog/typescript-habits-production-bugs",
    urlToImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-12T10:45:00.000Z",
    content:
      "## Summary\n\nTeams get the most value from TypeScript when they treat it as a boundary-defense tool, not just as autocomplete. Runtime validation and explicit modeling matter.\n\n## Good habits\n\nThe best gains come from checking external inputs, being explicit with domain types, and tightening unsafe assumptions before they become bugs.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "Building internship-ready backend projects",
    description:
      "A backend project stands out when it shows authentication, data modeling, error handling, and a clean API contract.",
    url: "https://internacademy.in/blog/internship-ready-backend-projects",
    urlToImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-05T07:20:00.000Z",
    content:
      "## Summary\n\nEven simple backend apps become credible portfolio pieces when they show reliable persistence, authorization, validation, and useful operational behavior.\n\n## What employers notice\n\nProjects feel more production-ready when they document data flow clearly and handle failure cases cleanly.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
  {
    source: { id: null, name: "InternAcademy" },
    author: "InternAcademy Editorial",
    title: "How to learn developer tools without getting overwhelmed",
    description:
      "The right sequence matters: start with Git, debugging, browser devtools, and deployment before chasing every new productivity tool.",
    url: "https://internacademy.in/blog/learning-developer-tools",
    urlToImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-06-29T12:00:00.000Z",
    content:
      "## Summary\n\nTooling helps when it reinforces core workflows. Students move faster when they master version control, inspection tools, and release workflows first.\n\n## Learning order\n\nFocus on the smallest set of tools that improve debugging, collaboration, and deployment before expanding into secondary productivity layers.\n\n## Source\n\nOriginally published by InternAcademy. Use the original article link for full context and updates.",
    category: "Technology",
  },
]

let memoryCache:
  | {
      articles: BlogArticle[]
      expiresAt: number
    }
  | undefined

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
}

function stripHtml(text: string) {
  return decodeEntities(text)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

function extractImage(item: FeedItem, fallbackImage: string) {
  const enclosureImage = item.enclosure?.url
  if (enclosureImage) {
    return enclosureImage
  }

  const mediaContentImage = asArray(item["media:content"])[0]?.$?.url
  if (mediaContentImage) {
    return mediaContentImage
  }

  const mediaThumbnailImage = asArray(item["media:thumbnail"])[0]?.$?.url
  if (mediaThumbnailImage) {
    return mediaThumbnailImage
  }

  const html = item["content:encoded"] || item.content || ""
  const matchedImage = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
  if (matchedImage) {
    return matchedImage
  }

  return fallbackImage
}

function buildParagraphs(text: string) {
  const cleaned = stripHtml(text)
  if (!cleaned) {
    return []
  }

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 8)

  const paragraphs: string[] = []
  for (let index = 0; index < sentences.length; index += 2) {
    const paragraph = sentences.slice(index, index + 2).join(" ").trim()
    if (paragraph) {
      paragraphs.push(paragraph)
    }
  }

  return paragraphs.slice(0, 4)
}

function buildArticleBody(
  description: string,
  content: string,
  sourceName: string,
  category: string
) {
  const paragraphs = buildParagraphs(content)

  const sections = [
    "## Summary",
    description || `${category} update from ${sourceName}.`,
  ]

  if (paragraphs.length) {
    sections.push("## Details", ...paragraphs)
  }

  sections.push(
    "## Source",
    `Originally published by ${sourceName}. Use the original article link for the full piece and the latest updates.`
  )

  return sections.join("\n\n")
}

function toIsoDate(value?: string) {
  if (!value) {
    return new Date().toISOString()
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString()
  }

  return date.toISOString()
}

function normalizeItem(item: FeedItem, feed: FeedConfig): BlogArticle | null {
  const title = stripHtml(item.title || "")
  const url = item.link?.trim()

  if (!title || !url) {
    return null
  }

  const description = truncate(
    stripHtml(
      item.contentSnippet || item.summary || item.content || item["content:encoded"] || ""
    ),
    240
  )

  const rawContent = item["content:encoded"] || item.content || item.summary || description
  const author = stripHtml(item.creator || item.author || "") || null

  return {
    source: {
      id: null,
      name: feed.name,
    },
    author,
    title,
    description: description || null,
    url,
    urlToImage: extractImage(item, feed.fallbackImage),
    publishedAt: toIsoDate(item.isoDate || item.pubDate),
    content: buildArticleBody(description, rawContent || description, feed.name, feed.category),
    category: feed.category,
  }
}

async function loadFeed(feed: FeedConfig) {
  const parsedFeed = await parser.parseURL(feed.url)

  return (parsedFeed.items || [])
    .map((item) => normalizeItem(item, feed))
    .filter((item): item is BlogArticle => Boolean(item))
}

async function fetchBlogsUncached() {
  const results = await Promise.allSettled(
    feedSources.map(async (feed) => loadFeed(feed))
  )

  const successfulArticles = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  )

  const seen = new Set<string>()
  const deduped = successfulArticles
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    )
    .filter((article) => {
      const key = `${article.url}::${article.title.toLowerCase()}`
      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
    .slice(0, 30)

  if (!deduped.length) {
    throw new Error("No RSS articles available")
  }

  return deduped
}

const getCachedBlogs = unstable_cache(fetchBlogsUncached, ["blog-feed-v2"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["blog-feed"],
})

export async function getBlogArticles() {
  if (memoryCache && memoryCache.expiresAt > Date.now()) {
    return memoryCache.articles
  }

  try {
    const articles = await getCachedBlogs()

    memoryCache = {
      articles,
      expiresAt: Date.now() + REVALIDATE_SECONDS * 1000,
    }

    return articles
  } catch (error) {
    console.error("Blog feed fetch failed:", error)

    if (memoryCache?.articles.length) {
      return memoryCache.articles
    }

    return fallbackArticles
  }
}