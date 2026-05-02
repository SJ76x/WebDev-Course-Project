import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/client/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
});