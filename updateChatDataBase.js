import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

async function updateDb() {
  const updateChat = await prisma.chat.update({
    where: {
      id: 20,
    },
    data: {
      communityChat: "Community chat",
    },
  });

  console.log(updateChat)
}

updateDb()
