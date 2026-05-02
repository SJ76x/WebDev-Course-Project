import prisma from './prisma.js';

export async function getAllPosts() {
    return await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            }
        }
    });
}

export async function getPostById(id) {
    return await prisma.post.findUnique({
        where: { id: id },
        include: {
            author: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            }
        }
    });
}

export async function getPostsByUser(userId) {
    return await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            }
        }
    });
}

export async function createPost(data) {
    return await prisma.post.create({
        data: {
            content: data.content,
            image: data.image,
            authorId: data.authorId,
        }
    });
}

export async function deletePost(id) {
    return await prisma.post.delete({
        where: { id: id }
    });
}

export async function toggleLike(userId, postId) {
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: userId,
                postId: postId,
            }
        }
    });
    if (existingLike) {
        //unlike
        await prisma.like.delete({
            where: { id: existingLike.id }
        });
        return false;
    } else {
        //like
        await prisma.like.create({
            data: {
                userId: userId,
                postId: postId,
            }
        });
        return true;
    }
}

export async function isLikedByUser(userId, postId) {
    const like = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: userId,
                postId: postId,
            }
        }
    });
    return like !== null;
}
