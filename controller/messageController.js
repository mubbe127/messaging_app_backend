import prisma from "../model/prismaClient.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

export const createMessage = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = Number(req.body.userId);
      console.log(userId);
      const chatId = Number(req.body.chatId);
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          chatId,
        },
      });
      console.log("req file", req.file);

      if (req.file) {
        console.log(req.file);
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
        console.log("the file", file);
      }
      res.status(201).json({ message: "Succesfully created message", message });
    } catch (error) {
      console.error("Error creating file:", error);
      res.status(500).json({ message: "Failed to create file", error });
    }
  },
];
export const getChatOrUserMessages = async (req, res) => {
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
};

export const getMessages = async (req, res) => {
  try {
    const allMessages = await prisma.message.findMany();
    res.status(200).json(allMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
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
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.body;
  try {
    const deleteMessage = await prisma.message.delete({
      where: {
        messageId,
      },
    });
    res.status(200).json({ message: "Successfully deleted message" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { content, messageId } = req.body;

    const updateMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
    });
    res.status(200).json({ message: "Succesfully updated message" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update message " });
  }
};

export const updateViewedMessages = async (req, res) => {
 

  try {
    console.log("update view messages")
    const chatId = Number(req.body.chatId);
    const userId = Number(req.body.userId)

    // Fetch messages by chatId
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
    });

    console.log(messages)
  
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

    const messageWithViewers = await prisma.message.findMany({
      where: {
        chatId
      },
      include: {
        viewedBy: true, // Include the users who viewed the message
      },
    });
   
    console.log("succesfully updated view")
    res.status(200).json({ message: "ViewedBy updated for all messages in chat.", messageWithViewers });
  } catch (error) {
    console.log("failed update messages",error);
    res.status(500).json({ error: "Failed to update messages viewedBy relations." });
  }
};