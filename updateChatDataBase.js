import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile =".env.production"
  
dotenv.config({ path: envFile });

async function createChat(){

    const createChat = await prisma.chat.create({
        data: {
            name: "Community chat",
            communityChat: "Community chat"
        }
    })

    console.log(createChat)
}

createChat()

