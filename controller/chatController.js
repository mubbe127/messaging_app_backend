import prisma from "../model/prismaClient.js";

export const createChat = async (req, res) => {
  const { name} = req.body;
  const userId  = Number(req.body.userId)
  const memberIds = JSON.parse(req.body.memberIds);
  const newChat = await prisma.chat.create({
    data: {
      name,
      userId,
      members: {
        connect: memberIds.map((id) => ({ id })),
      },
      admins: {
        connect: [{ id: userId }],
      },
    },
  });

  // Step 2: Send the response
  res.status(201).json(newChat);
};

export const getChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
        include: {
            members:true,
            messages:true
        }
    });
    res.status(201).json({ chats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getChat = async (req, res) => {
  const id = Number(req.params.chatId);
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        members:true,
        messages:true
      }
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
    }
    res.status(201).json({ chat });
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
