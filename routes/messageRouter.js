import {Router} from "express";


const messageRouter = Router()


messageRouter.get('/', getMessages)
messageRouter.get('/:id', getMessage)
messageRouter.post('/', createMessage)
messageRouter.put('/:id', updateMessage)
messageRouter.delete('/id', deleteMessage)


export default messageRouter