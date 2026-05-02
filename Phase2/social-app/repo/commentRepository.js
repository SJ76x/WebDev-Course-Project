import prisma from './prisma.js';

export async function getCommentsByPost(postId) {
    return await prisma.comment.findMany({
        where: { postId: postId },
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
        }
    });
}

export async function createComment(data) {
    return await prisma.comment.create({
        data: {
            content: data.content,
            postId: data.postId,
            authorId: data.authorId,
        }
    });
}
