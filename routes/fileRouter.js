import { Router } from "express";
import { getFile } from "../controller/fileController.js";

const fileRouter = Router();

fileRouter.get('/:fileId', getFile)

export default fileRouter;
