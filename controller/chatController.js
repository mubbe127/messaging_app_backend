import prisma from "../model/prismaClient.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

import { verifyAccessToken } from "../services/tokenUtils.js";
export const createChat = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({ error: "Authorization not valid" });
  }
  const { name, memberIds } = req.body;
  const userId = Number(req.body.userId);
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  let parsedMembersIds = memberIds;
  if (typeof parsedMembersIds === "string") {
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

  try {
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
    return res.status(500).json({ message: "Internal server error" });
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
        members: { some: { id: userId } },
      },
      include: {
        members: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            username: true,
            membershipStatus: true,
            profileImage: true,
          },
        },
        messages: {
          include: {
            files: true,
            viewedBy: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    console.log(chats)
    return res.status(201).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
    console.log("failed getting chats", error);
  }
};

export const getChat = async (req, res) => {
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

  const id = Number(req.params.chatId);

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
        members: { some: { id: userId } },
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
            files: true, // Include the related files for each message
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const updateChat = [
  upload.single("file"),
  async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Extract the token from the header (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    const user = verifyAccessToken(token);

    const userId = user.sub;

    if (!user) {
      return res.status(401).json({ error: "Authorization not valid" });
    }

    const chatId = Number(req.params.chatId);
    const { name, memberIds } = req.body;
    const updateData = {
      where: { id: chatId, members: { some: { id: userId } } },
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
    console.log("req fil2", req.file);
    if (req.file) {
      updateData.data.profileImage = req.file.path;
    }
    try {
      const updatedChat = await prisma.chat.update(updateData);

      // Logic for updating user
      return res
        .status(200)
        .json({ message: "Chat updated successfully", updatedChat });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to update chat" });
    }
  },
];

export const deleteChat = async (req, res) => {
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
  const id = Number(req.params.chatId);

  try {
    const deleteChat = await prisma.chat.delete({
      where: {
        id,
        members: { some: { id: userId } },
      },
    });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
