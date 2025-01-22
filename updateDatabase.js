import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });



async function updateDb() {
  const updateUser = await prisma.user.update({
    where: {
      id: 25,
    },
    data: {
      membershipStatus: "admin",
    },
  });
}

updateDb()

