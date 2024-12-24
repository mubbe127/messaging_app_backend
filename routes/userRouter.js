import {Router} from "express";


const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/', getUser)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/id', deleteUser)

userRouter.get('/:id/chats/:id', getUserChats)
userRouter.get('/:id/messages/:id', getUserMessages)


export default userRouter