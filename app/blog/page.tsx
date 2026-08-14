"use client"

import { useState, useEffect, useRef } from "react"
import SiteHeader from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { InternBotWidget } from "@/components/internbot-widget"
import { BlogSubscribeForm } from "@/components/blog/blog-subscribe-form"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

interface BlogArticle {
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Dynamic metadata mapping for authors (avatars, bio roles)
function getPostMetadata(post: any) {
  const avatars: Record<string, string> = {
    "Olivia Rhys": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    "Phoenix Baker": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    "Lana Steiner": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    "Alec Whitten": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    "Demi Wilkinson": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    "Candice Wu": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    "Natali Craig": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    "Drew Cano": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    "Orlando Diggs": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    "John Griebel": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  }
  
  const roles: Record<string, string> = {
    "Olivia Rhys": "Technical Writer & Infrastructure Engineer",
    "Phoenix Baker": "Senior Frontend Architect",
    "Lana Steiner": "Co-Founder & VP of Product",
    "Alec Whitten": "Senior Web Developer",
    "Demi Wilkinson": "AI Product Researcher",
    "Candice Wu": "Product Designer",
    "Natali Craig": "Director of Engineering",
    "Drew Cano": "UX Lead",
    "Orlando Diggs": "Developer Relations Engineer",
    "John Griebel": "Self-taught Designer & Developer"
  }
  
  return {
    avatar: post.authorAvatar || avatars[post.author] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    role: post.authorRole || roles[post.author] || "Technical Contributor"
  }
}

// Helper to retrieve post body content dynamically
function getPostBody(post: any) {
  if (post.body) {
    return post.body.split("\n\n").map((para: string) => {
      const trimmed = para.trim()

      if (!trimmed) {
        return ""
      }

      if (trimmed.startsWith("## ")) {
        return `<h2 class="font-serif text-gray-900 text-xl sm:text-2xl font-bold mt-8 mb-4">${escapeHtml(trimmed.replace(/^##\s*/, ""))}</h2>`
      }

      return `<p>${escapeHtml(trimmed)}</p>`
    }).join("")
  }
  
  const paragraphs = [
    `<h2 class="font-serif text-gray-900 text-xl sm:text-2xl font-bold mt-8 mb-4">Summary</h2>`,
    `<p>${escapeHtml(post.excerpt || "No summary available for this article.")}</p>`,
    `<h2 class="font-serif text-gray-900 text-xl sm:text-2xl font-bold mt-8 mb-4">Source</h2>`,
    `<p>${escapeHtml(`Originally published by ${post.sourceName || "the original publisher"}. Use the original article link to read the full piece and latest updates.`)}</p>`
  ]
  
  return paragraphs.join("")
}

export default function BlogPage() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)

  const allPostsRef = useRef<HTMLDivElement>(null) // ADD THIS
  
  // Scroll to all posts section top on page change
useEffect(() => {
  async function fetchArticles() {
    try {
      const response = await fetch("/api/blogs")

      if (!response.ok) {
        throw new Error("Failed to fetch articles")
      }

      const data = await response.json()

      setArticles(data)
    } catch (error) {
      console.error("Error fetching blog articles:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchArticles()
}, [])


const apiPosts = articles.map((article) => ({
  image: article.urlToImage || "/placeholder.jpg",
  author: article.author || article.source.name || "Unknown Author",
  date: new Date(article.publishedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  title: article.title,
  excerpt: article.description || "No description available.",
  body: article.content || article.description || "",
  sourceName: article.source.name,
  sourceUrl: article.url,
  url: article.url,
  dateDetail: new Date(article.publishedAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
  tags: [article.category, article.source.name],
}))

const featuredApiPost = apiPosts[0]
const sideApiPosts = apiPosts.slice(1, 4)
const allApiPosts = apiPosts.slice(4)


  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setEmail("")
    }, 4000)
  }



  // Pagination Logic
const postsPerPage = 6
const totalPages = Math.ceil(allApiPosts.length / postsPerPage)
const indexOfLastPost = currentPage * postsPerPage
const indexOfFirstPost = indexOfLastPost - postsPerPage
const currentPosts = allApiPosts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Existing Navbar */}
      <SiteHeader/>

      <main className="flex-grow bg-white">
        {selectedPost ? (
          <div className="relative w-full">
            {/* Back Button - positioned far left close to edge of screen */}
            <div className="absolute left-6 md:left-12 lg:left-16 xl:left-24 top-6 md:top-10 z-10">
              <button
                onClick={() => {
                  setSelectedPost(null)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to articles
              </button>
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-16 md:pt-10 pb-16 md:pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mt-4 mb-6 text-center leading-tight max-w-4xl mx-auto">
                {selectedPost.title}
              </h1>

              {/* Subheading / Description */}
              <div className="max-w-3xl mx-auto font-inter text-gray-500 text-lg sm:text-xl leading-relaxed text-center mb-8 px-4 font-medium italic">
                {selectedPost.excerpt}
              </div>

              {/* Author Profile & Date */}
              {(() => {
                const meta = getPostMetadata(selectedPost)
                return (
                  <div className="flex items-center justify-between gap-6 mb-10 max-w-2xl mx-auto pb-4 border-b border-gray-100">
                    {/* Left Side: Author Profile */}
                    <div className="flex items-center gap-3.5">
                      <div className="size-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                        <img
                          src={meta.avatar}
                          alt={selectedPost.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-inter text-sm font-bold text-gray-900 leading-none mb-1">
                          {selectedPost.author}
                        </div>
                        <div className="font-inter text-xs text-gray-400">
                          {meta.role}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Date */}
                    <div className="text-right">
                      <time className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        {selectedPost.dateDetail || (selectedPost.date ? `${selectedPost.date.toUpperCase()}, 10:00 AM` : "OCTOBER 19, 2016, 10:50 PM")}
                      </time>
                    </div>
                  </div>
                )
              })()}

              {/* Thumbnail Image */}
              <div className="relative aspect-[16/10] w-full max-w-3xl mx-auto rounded-2xl overflow-hidden mb-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 bg-gray-50">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="max-w-3xl mx-auto mb-10 flex justify-center">
                <a
                  href={selectedPost.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#004aad] hover:text-[#004aad] transition-colors"
                >
                  Read original article
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Blog Body Content */}
              <div className="max-w-2xl mx-auto">
                <div 
                  className="font-serif text-gray-700 text-base sm:text-lg leading-relaxed space-y-6 first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:text-gray-900 first-letter:font-serif"
                  dangerouslySetInnerHTML={{ __html: getPostBody(selectedPost) }}
                />
              </div>
            </article>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
              <div className="inline-block bg-[#004aad]/10 text-[#004aad] px-4 py-1.5 rounded-full font-inter text-xs font-semibold tracking-wider uppercase mb-6">
                Our Blog
              </div>
              <h1 className="font-montserrat text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
                Inside Design: Stories and interviews
              </h1>
              <p className="font-inter text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Subscribe to learn about new product features, the latest in technology, and updates.
              </p>

              {/* Email Subscription Form */}
              <BlogSubscribeForm />
            </section>

            {/* Recent Blog Posts Section */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
              <h2 className="font-montserrat text-center text-xl sm:text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
                Recent blog posts
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Featured Post (Left) */}
                {featuredApiPost && (
                <article onClick={() => {
                  setSelectedPost(featuredApiPost)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }} className="group cursor-pointer flex flex-col">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <img
                      src={featuredApiPost.image}
                      alt={featuredApiPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#004aad] mb-2 font-inter">
                      <span>{featuredApiPost.author}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{featuredApiPost.date}</span>
                    </div>
                    <h3 className="font-montserrat text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#004aad] transition-colors mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-left">
                        {featuredApiPost.title}
                        <ArrowUpRight className="size-5 inline-block text-gray-400 group-hover:text-[#004aad] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                      </span>
                    </h3>
                    <p className="font-inter text-gray-500 text-sm sm:text-base leading-relaxed mb-6 text-left">
                      {featuredApiPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {featuredApiPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-50 text-gray-600 border border-gray-200 px-3.5 py-1 rounded-full font-inter text-xs font-semibold transition-colors hover:bg-gray-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
                )}

                {/* Vertical Posts List (Right) */}
                <div className="flex flex-col gap-10">
                  {sideApiPosts.map((post, idx) => (
                    <article onClick={() => {
                      setSelectedPost(post)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }} key={idx} className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                      <div className="w-full sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#004aad] mb-1.5 font-inter">
                            <span>{post.author}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">{post.date}</span>
                          </div>
                          <h4 className="font-montserrat text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#004aad] transition-colors mb-2 leading-snug text-left">
                            {post.title}
                          </h4>
                          <p className="font-inter text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2 text-left">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-50 text-gray-600 border border-gray-200 px-3.5 py-1 rounded-full font-inter text-xs font-semibold transition-colors hover:bg-gray-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* All Blog Posts Section */}
            <section ref={allPostsRef} className="max-w-7xl mx-auto px-6 pb-24 border-t border-gray-100 pt-16 scroll-mt-20">
              <h2 className="font-montserrat text-xl sm:text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                All blog posts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, idx) => (
                  <article onClick={() => {
                    setSelectedPost(post)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }} key={idx} className="group cursor-pointer flex flex-col">
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#004aad] mb-2 font-inter">
                        <span>{post.author}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{post.date}</span>
                      </div>
                      <h3 className="font-montserrat text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#004aad] transition-colors mb-2.5 flex items-start justify-between text-left">
                        <span className="inline-flex items-center gap-1">
                          {post.title}
                          <ArrowUpRight className="size-4 inline-block text-gray-400 group-hover:text-[#004aad] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                        </span>
                      </h3>
                      <p className="font-inter text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3 text-left">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-50 text-gray-600 border border-gray-200 px-3.5 py-0.5 rounded-full font-inter text-xs font-semibold transition-colors hover:bg-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-16">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`size-10 rounded-lg text-sm font-semibold transition-all select-none border ${
                          currentPage === pageNumber
                            ? "bg-[#004aad] text-white border-[#004aad] shadow-md shadow-[#004aad]/20"
                            : "text-gray-500 hover:bg-gray-50 border-transparent"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Existing Footer */}
      <SiteFooter />

      {/* Existing Widget */}
      <InternBotWidget />
    </div>
  )
}
