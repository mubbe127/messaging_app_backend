import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
import express from "express";
import chatRouter from './routes/chatRouter';
import userRouter from './routes/userRouter';
import messageRouter from './routes/messageRouter';

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

app.listen(4100, () => console.log("app listening on port 4100!"));

