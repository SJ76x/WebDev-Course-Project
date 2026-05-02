import { NextResponse } from "next/server";
import {
    getAverageFollowersPerUser,
    getAveragePostsPerUser,
    getMostActiveUserLast3Months,
    getMostLikedPost,
    getMostCommentedPost,
    getTop5UsersByFollowers,
} from "@/repo/statsRepository";

export async function GET() {
    const averageFollowersPerUser = await getAverageFollowersPerUser();
    const averagePostsPerUser = await getAveragePostsPerUser();
    const mostActiveUserLast3Months = await getMostActiveUserLast3Months();
    const mostLikedPost = await getMostLikedPost();
    const mostCommentedPost = await getMostCommentedPost();
    const top5UsersByFollowers = await getTop5UsersByFollowers();

    return NextResponse.json({
        averageFollowersPerUser,
        averagePostsPerUser,
        mostActiveUserLast3Months,
        mostLikedPost,
        mostCommentedPost,
        top5UsersByFollowers,
    });
}
