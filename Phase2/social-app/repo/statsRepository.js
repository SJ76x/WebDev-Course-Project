import prisma from './prisma.js';

// 1. Average number of followers per user
export async function getAverageFollowersPerUser() {
    const userCount = await prisma.user.count();
    if (userCount === 0) return 0;
    const followCount = await prisma.follow.count();
    return followCount / userCount;
}

// 2. Average number of posts per user
export async function getAveragePostsPerUser() {
    const userCount = await prisma.user.count();
    if (userCount === 0) return 0;
    const postCount = await prisma.post.count();
    return postCount / userCount;
}

// 3. Most active user in the last 3 months (most posts)
export async function getMostActiveUserLast3Months() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const grouped = await prisma.post.groupBy({
        by: ['authorId'],
        where: { createdAt: { gte: threeMonthsAgo } },
        _count: { _all: true },
        orderBy: { _count: { authorId: 'desc' } },
        take: 1,
    });

    if (grouped.length === 0) return null;

    const top = grouped[0];
    const user = await prisma.user.findUnique({
        where: { id: top.authorId },
    });

    return { user: user, postCount: top._count._all };
}

// 4. Most liked post
export async function getMostLikedPost() {
    return await prisma.post.findFirst({
        orderBy: { likes: { _count: 'desc' } },
        include: {
            author: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
    });
}

// 5. Most commented post
export async function getMostCommentedPost() {
    return await prisma.post.findFirst({
        orderBy: { comments: { _count: 'desc' } },
        include: {
            author: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
    });
}

// 6. Top 5 users with the most followers
export async function getTop5UsersByFollowers() {
    return await prisma.user.findMany({
        orderBy: { followers: { _count: 'desc' } },
        take: 5,
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });
}
