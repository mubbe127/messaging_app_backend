import {Router} from "express";
import { searchChatByExactMembers, searchChatsAndUsers } from "../controller/searchController.js";


const searchRouter = Router()

searchRouter.post('/chats-users', searchChatsAndUsers)
searchRouter.post('/chatbymembers', searchChatByExactMembers)




export default searchRouter