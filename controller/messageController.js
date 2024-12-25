import prisma from "../model/prismaClient";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const createMessage = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { content, chatId, userId } = req.body;
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          chatId,
        },
      });
      if (req.file) {
        const file = await prisma.file.create({
          data: {
            name: req.file.originalname,
            size: req.file.size,
            path: req.file.path,
            userId: req.user.id,
            messageId: message.id,
          },
        });
      }
      res.status(201).json({ message: "Succesfully created message" });
    } catch (error) {
      console.error("Error creating file:", error);
      res.status(500).json({ message: "Failed to create file", error });
    }
  },
];
const getChatOrUserMessages = async (req, res) => {
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

const getMessages = async (req, res) => {
  try {
    const allMessages = await prisma.message.findMany();
    res.status(200).json(allMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
const getMessage = async (req, res) => {
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

const deleteMessage = async (req, res) => {
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

const updateMessage = async (req, res) => {
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
