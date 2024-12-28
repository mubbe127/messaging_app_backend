import dotenv from 'dotenv';
import prisma from './model/prismaClient.js';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const deleteToken= await prisma.token.deleteMany()
const deleteFiles = await prisma.file.deleteMany()
const deleteMessage= await prisma.message.deleteMany()
const deleteUser = await prisma.user.deleteMany()

const deleteChat = await prisma.chat.deleteMany()


