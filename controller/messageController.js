import prisma from "../model/prismaClient.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import { verifyAccessToken } from "../services/tokenUtils.js";

export const createMessage = [
  upload.single("file"),
  async (req, res) => {
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
    const { content } = req.body;
    const chatId = Number(req.body.chatId);
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          members: { some: { id: userId } },
        },
      });

    } catch (error) {
      return res
        .status(401)
        .json({ error: "Authorization not valid, not a member of chat" });
    }
    try {
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          chatId,
        },
      });

      if(req.file){
      const file = await prisma.file.create({
        data: {
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: req.file.path,
          userId,
          messageId: message.id,
        },
      });
      }
      const updateChat = await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          updatedAt: new Date(), 
        }
      })
     
      console.log("succesfully created");
      return res
        .status(201)
        .json({ message: "Succesfully created message", message });
    } catch (error) {
      console.error("Error creating file:", error);
      return res.status(500).json({ message: "Failed to create file", error });
    }
  },
];

/*
export const getChatOrUserMessages = async (req, res) => {
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

  try {
    const { chatId, userId } = req.body;

    const whereClause = {
      ...(chatId && { chatId }), // Add chatId if it is defined
      ...(userId && { userId }), // Add userId if it is defined
    };

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        files: true,
      },
    });
    if (messages.length > 0) {
      return res.status(404).json({ message: "Messages no found" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch message" });
  }
}; */

/*
export const getMessages = async (req, res) => {
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

  try {
    const allMessages = await prisma.message.findMany();
    res.status(200).json(allMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}; */

/*
export const getMessage = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        files: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch message" });
  }
}; */

export const deleteMessage = async (req, res) => {
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
  const { messageId } = req.body;
  try {
    const deleteMessage = await prisma.message.delete({
      where: {
        id: messageId,
        userId,
      },
    });
    return res.status(200).json({ message: "Successfully deleted message" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete message" });
  }
};

export const updateMessage = async (req, res) => {
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
  const { content, messageId } = req.body;

  try {
    const updateMessage = await prisma.message.update({
      where: {
        id: messageId,
        userId,
      },
      data: {
        content,
      },
    });
    return res.status(200).json({ message: "Succesfully updated message" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update message " });
  }
};

export const updateViewedMessages = async (req, res) => {
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
  console.log("update view messages");
  const chatId = Number(req.body.chatId);
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        members: { some: { id: userId } },
      },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authorization not valid, not a member of chat" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
    });

    // Update each message's viewedBy relation
    for (const message of messages) {
      await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          viewedBy: {
            connect: { id: userId },
          },
        },
      });
    }
    console.log("succesfully updated view");
    return res.status(200).json({
      message: "ViewedBy updated for all messages in chat.",
    });
  } catch (error) {
    console.log("failed update messages", error);
    return res
      .status(500)
      .json({ error: "Failed to update messages viewedBy relations." });
  }
};
