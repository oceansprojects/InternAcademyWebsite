import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { sql } from "@/lib/db";
import { notifySubscribersOnPublish } from "@/services/blog-notification.service";

export async function GET() {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const posts = await sql`
      SELECT id, slug, title, excerpt, cover_image_url, status, published_at, notification_sent_at, created_at, updated_at
      FROM blog_posts
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("[GET /api/admin/blogs Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, cover_image_url, status = "draft" } = body || {};

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: "Title and slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const isPublished = status === "published";
    const publishedAt = isPublished ? new Date().toISOString() : null;

    // Get current user id for author_id if available
    const userId = authCheck.session?.user?.id || null;

    let newPostRes: any[];
    if (userId) {
      newPostRes = await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, status, published_at, author_id)
        VALUES (${title}, ${cleanSlug}, ${excerpt || null}, ${content || null}, ${cover_image_url || null}, ${status}, ${publishedAt}, ${userId})
        RETURNING id, title, slug, excerpt, content, cover_image_url, status, published_at, notification_sent_at, created_at
      `;
    } else {
      newPostRes = await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, status, published_at)
        VALUES (${title}, ${cleanSlug}, ${excerpt || null}, ${content || null}, ${cover_image_url || null}, ${status}, ${publishedAt})
        RETURNING id, title, slug, excerpt, content, cover_image_url, status, published_at, notification_sent_at, created_at
      `;
    }

    const post = newPostRes[0];

    // If published immediately, dispatch notifications in background non-blocking
    if (isPublished && post) {
      void notifySubscribersOnPublish({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        cover_image_url: post.cover_image_url,
        published_at: post.published_at,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: isPublished
          ? "Blog post published successfully! Subscriber notifications triggered."
          : "Blog post created as draft.",
        data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/admin/blogs Error]:", error);

    if (error?.code === "23505") {
      return NextResponse.json(
        { success: false, message: "A blog post with this slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
