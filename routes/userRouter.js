import {Router} from "express";
import {getUsers, getUser, createUser, updateUser, deleteUser,getUserChats} from "../services/userService.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/', getUser)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/id', deleteUser)

userRouter.get('/:id/chats/:id', getUserChats)
userRouter.get('/:id/messages/:id', getUserMessages)


export default userRouter