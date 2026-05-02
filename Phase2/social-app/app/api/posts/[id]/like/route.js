import { NextResponse } from "next/server";
import { toggleLike, getPostById } from "@/repo/postRepository";

export async function POST(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    if (!body.userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const liked = await toggleLike(body.userId, id);
    const post = await getPostById(id);
    const likeCount = post._count.likes;

    return NextResponse.json({ liked: liked, likeCount: likeCount });
}
