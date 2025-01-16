import {Router} from "express";
import  {getUser, createUser, updateUser, deleteUser} from "../controller/userController.js";
import { loginUser, logout, refreshUserToken } from "../controller/userController.js";

const userRouter = Router()


userRouter.get('/:userId', getUser)
userRouter.post('/', createUser)
userRouter.put('/:userId', updateUser)
userRouter.delete('/userId', deleteUser)




userRouter.post('/login', loginUser)
userRouter.post('/refresh-token', refreshUserToken)
userRouter.post('/logout', logout)


export default userRouter