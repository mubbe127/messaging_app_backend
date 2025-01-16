import {Router} from "express";
import { createMessage, updateMessage, deleteMessage, updateViewedMessages } from "../controller/messageController.js";


const messageRouter = Router()


/*messageRouter.get('/', getMessages) */
/*messageRouter.get('/:id', getMessage) */
messageRouter.post('/', createMessage)
messageRouter.put("/viewed", updateViewedMessages)
messageRouter.put('/:id', updateMessage)
messageRouter.delete('/id', deleteMessage)



export default messageRouter