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
chatRouter.get("/:id", getChat);
chatRouter.post("/", createChat);
chatRouter.put("/:id", updateChat);
chatRouter.delete("/id", deleteChat);

export default chatRouter;
