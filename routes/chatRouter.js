import { Router } from "express";
import {
  getChats,
  getChat,

  createChat,
  updateChat,
  deleteChat,
} from "../controller/chatController.js";

const chatRouter = Router();

chatRouter.get("/", getChats);
chatRouter.get("/:chatId", getChat);
chatRouter.post("/", createChat);
chatRouter.put("/:chatId", updateChat);
chatRouter.delete("/chatId", deleteChat);

export default chatRouter;
