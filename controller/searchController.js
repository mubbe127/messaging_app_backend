
import prisma from "../model/prismaClient.js";

import {
  verifyAccessToken,
} from "../services/tokenUtils.js";

export const searchChatsAndUsers = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Extract the token from the header (format: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({ error: "Authorization not valid" });
  }

  const userId = user.sub;

  const { searchTerm } = req.body;

  try {
   
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
        members: {
          some: { id: userId },
        },
        name: { contains: searchTerm, mode: "insensitive" },
      },
      include: {
        members: {
          select: {
            id: true, // Include only the fields you need
            firstname: true,
            lastname: true,
            email: true,
            username: true,
            membershipStatus: true,
            profileImage:true,
          },
        },
        messages: {
          include: {
            files: true,
          },
        },
      },
    });

    return res.status(201).json({ chats, users });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const searchChatByExactMembers = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Extract the token from the header (format: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({ error: "Authorization not valid" });
  }

  const userId = user.sub;
  const memberIds = req.body.memberIds;
  if (!memberIds.includes(userId)) {
    memberIds.push(userId);
  }
  try {
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
        members: {
          select: {
            id: true, // Include only the fields you need
            firstname: true,
            lastname: true,
            email: true,
            username: true,
            membershipStatus: true,
            profileImage:true,
          },
        },
        messages: true,
      },
    });

    const exactChats = chats.filter((chat) => {
      const chatMemberIds = chat.members.map((member) => member.id);

      return (
        chatMemberIds.length === memberIds.length &&
        memberIds.every((id) => chatMemberIds.includes(id))
      );
    });
    return res.status(201).json({ foundchat: exactChats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to fecth" });
  }
};
