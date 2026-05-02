import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "../../../repo/postRepository";

export async function GET() {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
}

export async function POST(request) {
    const body = await request.json();

    if (!body.content || !body.authorId) {
        return NextResponse.json(
            { error: "content and authorId are required" },
            { status: 400 }
        );
    }

    const newPost = await createPost(body);
    return NextResponse.json(newPost, { status: 201 });
}
