/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "../repo/prisma";
import { faker } from "@faker-js/faker";

async function seed() {
    //clear database
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    
    //create users with posts
    for (let i = 0; i < 25; i++) {
        await prisma.user.create({
            data: {
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                bio: faker.lorem.sentence(),
                posts: {
                    create: Array.from({ length: Math.floor(Math.random() * 5) }).map(() => ({
                        content: faker.lorem.paragraph(),
                    })),
                }
            }
        });
    }
    
    //create random likes follows and comments
    for (let i = 0; i < 50; i++) {
        
        let randUser = await prisma.$queryRaw`SELECT id FROM "User" ORDER BY RANDOM() LIMIT 1`;
        let randPost = await prisma.$queryRaw`SELECT id FROM "Post" ORDER BY RANDOM() LIMIT 1`;
        try{
            await prisma.like.create({
                data: {
                    postId: randPost[0].id,
                    userId: randUser[0].id,
                }
            });
        } catch (e) {}
        

        let randUser2 = await prisma.$queryRaw`SELECT id FROM "User" ORDER BY RANDOM() LIMIT 1`;
        let randUser21 = await prisma.$queryRaw`SELECT id FROM "User" ORDER BY RANDOM() LIMIT 1`;
        try{
            await prisma.follow.create({
                data: {
                    followerId: randUser2[0].id,
                    followingId: randUser21[0].id,
                }
            });
        } catch (e) {}
        

        let randUser3 = await prisma.$queryRaw`SELECT id FROM "User" ORDER BY RANDOM() LIMIT 1`;
        let randPost3 = await prisma.$queryRaw`SELECT id FROM "Post" ORDER BY RANDOM() LIMIT 1`;
        await prisma.comment.create({
            data: {
                content: faker.lorem.sentence(),
                authorId: randUser3[0].id,
                postId: randPost3[0].id,
            }
        });
    }
}
seed().catch(console.error);