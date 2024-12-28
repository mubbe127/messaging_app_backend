import {Router} from "express";
import {getUsers, getUser, createUser, updateUser, deleteUser,getUserChats} from "../controller/userController.js";
import { loginUser, logout, refreshUserToken } from "../controller/userController.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/', getUser)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/id', deleteUser)

userRouter.get('/:id/chats/:id', getUserChats)


userRouter.post('/login', loginUser)
userRouter.post('/refresh-token', refreshUserToken)
userRouter.post('/logout', logout)


export default userRouter