"use client";

import { useState, useEffect } from "react";

export default function StatsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const res = await fetch("/api/stats");
            const data = await res.json();
            setStats(data);
            setLoading(false);
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <main className="p-8">
                <p>Loading stats...</p>
            </main>
        );
    }

    if (!stats) {
        return (
            <main className="p-8">
                <p>Could not load stats.</p>
            </main>
        );
    }

    const cardStyle = "border border-gray-300 rounded-lg p-5 bg-white shadow-sm";
    const headingStyle = "text-lg font-semibold mb-2";
    const bigNumberStyle = "text-3xl font-bold";

    return (
        <main className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Statistics</h1>

            <div className="grid gap-4 md:grid-cols-2">

                {/* 1. Average Followers per User */}
                <div className={cardStyle}>
                    <h2 className={headingStyle}>Average Followers per User</h2>
                    <p className={bigNumberStyle}>
                        {stats.averageFollowersPerUser.toFixed(2)}
                    </p>
                </div>

                {/* 2. Average Posts per User */}
                <div className={cardStyle}>
                    <h2 className={headingStyle}>Average Posts per User</h2>
                    <p className={bigNumberStyle}>
                        {stats.averagePostsPerUser.toFixed(2)}
                    </p>
                </div>

                {/* 3. Most Active User (last 3 months) */}
                <div className={cardStyle}>
                    <h2 className={headingStyle}>Most Active User (last 3 months)</h2>
                    {stats.mostActiveUserLast3Months ? (
                        <>
                            <p className="text-xl font-semibold">
                                @{stats.mostActiveUserLast3Months.user.username}
                            </p>
                            <p className="text-gray-600">
                                {stats.mostActiveUserLast3Months.postCount} posts
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">No posts in the last 3 months.</p>
                    )}
                </div>

                {/* 4. Most Liked Post */}
                <div className={cardStyle}>
                    <h2 className={headingStyle}>Most Liked Post</h2>
                    {stats.mostLikedPost ? (
                        <>
                            <p className="italic">&ldquo;{stats.mostLikedPost.content}&rdquo;</p>
                            <p className="text-sm text-gray-600 mt-2">
                                by @{stats.mostLikedPost.author.username} ·{" "}
                                {stats.mostLikedPost._count.likes} likes
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>

                {/* 5. Most Commented Post */}
                <div className={cardStyle}>
                    <h2 className={headingStyle}>Most Commented Post</h2>
                    {stats.mostCommentedPost ? (
                        <>
                            <p className="italic">&ldquo;{stats.mostCommentedPost.content}&rdquo;</p>
                            <p className="text-sm text-gray-600 mt-2">
                                by @{stats.mostCommentedPost.author.username} ·{" "}
                                {stats.mostCommentedPost._count.comments} comments
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>

                {/* 6. Top 5 Users by Followers */}
                <div className={`${cardStyle} md:col-span-2`}>
                    <h2 className={headingStyle}>Top 5 Users by Followers</h2>
                    {stats.top5UsersByFollowers.length === 0 ? (
                        <p className="text-gray-500">No users yet.</p>
                    ) : (
                        <ol className="list-decimal pl-6 space-y-1">
                            {stats.top5UsersByFollowers.map((user) => (
                                <li key={user.id}>
                                    <span className="font-semibold">@{user.username}</span>{" "}
                                    <span className="text-gray-600">
                                        — {user._count.followers} followers
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

            </div>
        </main>
    );
}
