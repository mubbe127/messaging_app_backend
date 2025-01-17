import dotenv from 'dotenv';
/*dotenv.config() -*/
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile }); 


import express from "express";
import cors from "cors"
import chatRouter from './routes/chatRouter.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import searchRouter from './routes/searchRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: '*', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  credentials: false, // No cookies or credentials involved
}));

// Ensure preflight OPTIONS requests are handled
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/users', userRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)
app.use('/api/search', searchRouter)

app.listen(4100, () => console.log("app listening on port 4100!"));

