import prisma from "./model/prismaClient.js";
import dotenv from "dotenv";
const envFile = ".env.production";

dotenv.config({ path: envFile });

async function getChat() {
  const createChat = await prisma.chat.findUnique({
    where: { id: 1 },
  });

  console.log(createChat);
}

getChat();
