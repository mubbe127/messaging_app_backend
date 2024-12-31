import { validationResult } from "express-validator";
import {
  validateUser,
  checkExistingUser,
} from "../validation/userValidation.js";

import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import prisma from "../model/prismaClient.js";
import bcrypt from "bcryptjs";
import passport from "../middlewares/authMiddleware.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifysAccessToken,
} from "../services/tokenUtils.js";

export const searchChatsAndUsers = async (req, res) => {
  const { searchTerm } = req.body;
  const  userId  = Number(req.body.userId)

  console.log(userId)
  try {
    console.log(searchTerm)
    const users = await prisma.user.findMany({
      where: {
      
        OR: [
          { firstname: { contains: searchTerm, mode: "insensitive" } },
          { lastname: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { username: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });
    const chats = await prisma.chat.findMany({
      where: {
        userId,
        name: { contains: searchTerm, mode: "insensitive" },
      },
    });

    console.log(chats)

    res.status(201).json({ chats, users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export async function searchChatByExactMembers(req, res) {

    try {
    const {memberIds, userId} = req.body 
    memberIds.push(userId)
    const chats = await prisma.chat.findMany({
      where: {
        name: null,
        members: {
          every: {
            id: { in: memberIds },
          },
        },
      },
      include: {
        members: true, 
      },
    });

    const exactChats = chats.filter(chat => {
      const chatMemberIds = chat.members.map(member => member.id);
      
      return (
        chatMemberIds.length === memberIds.length &&
        memberIds.every(id => chatMemberIds.includes(id))
      );
    });
    res.status(201).json({foundchat:exactChats})
    }catch(error) {

        res.status(500).json({message: "failed to fecth"})

    }
   
  }