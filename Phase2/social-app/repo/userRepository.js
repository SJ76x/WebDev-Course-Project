import prisma from "./prisma";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data) {
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      bio: data.bio ?? null,
      profilePicture: data.profilePicture ?? null,
    },
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data: {
      username: data.username,
      email: data.email,
      bio: data.bio,
      profilePicture: data.profilePicture,
    },
  });
}

export async function toggleFollow(followerId, followingId) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { following: false };
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return { following: true };
}