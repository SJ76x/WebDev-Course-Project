import prisma from '../prisma/client.js';

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
    include: {
        _count: {
            select: {
                posts: true,
                following: true,
                followers: true,
            }
        }
      },
  });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

export async function createUser(data) {
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      bio: data.bio,
    },
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id: id },
    data: {
      username: data.username,
      email: data.email,
      bio: data.bio,
    },
  });
}

export async function toggleFollow(followerId, followingId) {
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: followerId,
                followingId: followingId,
            },
        },
    });
    if (existingFollow) {
        //unfollow
        await prisma.follow.delete({
            where: {
                id: existingFollow.id,
            },
        });
        return false;
    } else {
        //follow
        await prisma.follow.create({
            data: {
                followerId: followerId,
                followingId: followingId,
            },
        });
        return true;
    }
}

export async function getAllUsers() {
    return await prisma.user.findMany();
}