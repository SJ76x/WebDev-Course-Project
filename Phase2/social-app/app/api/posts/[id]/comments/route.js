import { NextResponse } from "next/server";
import { getCommentsByPost, createComment } from "@/repo/commentRepository";

export async function GET(request, { params }) {
    const { id } = await params;
    const comments = await getCommentsByPost(id);
    return NextResponse.json(comments);
}

export async function POST(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    if (!body.content || !body.authorId) {
        return NextResponse.json(
            { error: "content and authorId are required" },
            { status: 400 }
        );
    }

    const newComment = await createComment({
        content: body.content,
        authorId: body.authorId,
        postId: id,
    });

    return NextResponse.json(newComment, { status: 201 });
}
