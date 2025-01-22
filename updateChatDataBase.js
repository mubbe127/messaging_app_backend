import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile =".env.production"
  
dotenv.config({ path: envFile });

async function updateDb() {
  const updateChat = await prisma.chat.update({
    where: {
      id: 1,
    },
    data: {
      communityChat: "Community chat",
    },
  });

  console.log(updateChat)
}

updateDb()
