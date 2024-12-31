import {Router} from "express";
import { searchChatsAndUsers } from "../controller/searchController.js";


const searchRouter = Router()

searchRouter.post('/chats-users', searchChatsAndUsers)




export default searchRouter