import { NextResponse } from "next/server";
import { getFeedPosts } from "../../../../../repo/postRepository";

export async function GET(request, { params }) {
  const { id } = await params;
  const posts = await getFeedPosts(id);
  return NextResponse.json(posts);
}