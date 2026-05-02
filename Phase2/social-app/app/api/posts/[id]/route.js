import { NextResponse } from "next/server";
import { getPostById, deletePost } from "@/repo/postRepository";

export async function GET(request, { params }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    const post = await getPostById(id);
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await deletePost(id);
    return NextResponse.json({ message: "Post deleted" });
}
