import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { sql } from "@/lib/db";
import { notifySubscribersOnPublish } from "@/services/blog-notification.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return authCheck.response!;
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const postCheck = await sql`
      SELECT id, title, slug, excerpt, cover_image_url, status, published_at, notification_sent_at 
      FROM blog_posts 
      WHERE id = ${id} 
      LIMIT 1
    `;

    if (postCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const existingPost = postCheck[0];

    // Update status to published and published_at to NOW()
    const updateRes = await sql`
      UPDATE blog_posts
      SET status = 'published', published_at = COALESCE(published_at, NOW()), updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, excerpt, cover_image_url, status, published_at, notification_sent_at
    `;

    const updatedPost = updateRes[0];

    // Trigger non-blocking subscriber notification in background
    void notifySubscribersOnPublish({
      id: updatedPost.id,
      title: updatedPost.title,
      excerpt: updatedPost.excerpt,
      slug: updatedPost.slug,
      cover_image_url: updatedPost.cover_image_url,
      published_at: updatedPost.published_at,
    });

    return NextResponse.json({
      success: true,
      message: "Blog post published successfully! Subscribers are being notified in the background.",
      data: updatedPost,
    });
  } catch (error) {
    console.error("[POST /api/admin/blogs/[id]/publish Error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to publish blog post" },
      { status: 500 }
    );
  }
}
