import prisma from "../model/prismaClient.js";

import { verifyAccessToken } from "../services/tokenUtils.js";
export const createChat = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const userId = Number(req.body.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

  
    let parsedMembersIds = memberIds;
    if (typeof parsedMembersIds === 'string') {
      try {
        parsedMembersIds = JSON.parse(parsedMembersIds);
      } catch {
        return res.status(400).json({ message: "Invalid memberIds format" });
      }
    }

    if (!Array.isArray(parsedMembersIds)) {
      return res.status(400).json({ message: "Member IDs must be an array" });
    }


    parsedMembersIds = [...new Set(parsedMembersIds.map(Number))];
    if (!parsedMembersIds.includes(userId)) {
      parsedMembersIds.push(userId);
    }


    const newChat = await prisma.chat.create({
      data: {
        name,
        members: {
          connect: parsedMembersIds.map((id) => ({ id })), // Use correct structure
        },
        admins: {
          connect: [{ id: userId }],
        },
      },
    });

 
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getChats = async (req, res) => {
  // Extract the Authorization header
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

  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: { some: { id: userId } }
      },
      include: {
        members: true,
        messages: true,
      },
    });
    console.log("Queried chats succesfully", chats);
    res.status(201).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
    console.log("failed getting chats", error);
  }
};

export const getChat = async (req, res) => {
  const id = Number(req.params.chatId);
  console.log("getchat", id)
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        members: true,
        messages: true,
      },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
    }
    res.status(201).json(chat );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const updateChat = async (req, res) => {
  const { chatId, name, memberIds } = req.body;

  const updateData = {
    where: { id: chatId },
    data: {},
  };

  if (name) {
    updateData.data.name = name;
  }

  if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
    updateData.data.members = {
      connect: memberIds.map((id) => ({ id })),
    };
  }

  const updatedChat = await prisma.chat.update(updateData);

  res.status(201).json(updatedChat);
};

export const deleteChat = async (req, res) => {
  try {
    const id = Number(req.params.chatId);

    const deleteChat = await prisma.chat.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
