import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile }); 

async function deleteDb(){
const deleteFiles = await prisma.file.deleteMany()
const deleteMessages = await prisma.message.deleteMany()
const deleteChat = await prisma.message.deleteMany()
const deleteToken = await prisma.token.deleteMany()
const deleteUser = await prisma.user.deleteMany()
}

deleteDb()
