import {Router} from "express";


const chatRouter = Router()

chatRouter.get('/', getChats)
chatRouter.get('/:id', getChat)
chatRouter.get('/:id/members/:id', getChatMembers)
chatRouter.get('/:id/messages/:id', getChatMessages)
chatRouter.post('/', createChat)
chatRouter.put('/:id', updateChat)
chatRouter.delete('/id', deleteChat)

export default chatRouter