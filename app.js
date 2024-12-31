import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
import express from "express";
import cors from "cors"
import chatRouter from './routes/chatRouter.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import searchRouter from './routes/searchRouter.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))


app.use('/api/users', userRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)
app.use('/api/search', searchRouter)

app.listen(4100, () => console.log("app listening on port 4100!"));

