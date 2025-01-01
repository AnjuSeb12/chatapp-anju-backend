import express from "express"
import { createMessage, getMessageByConversationId} from "../controllers/messageController.js";
import authenticateUser from "../middlewares/usermiddleware.js";


const messageRouter=express.Router()


messageRouter.post("/messageadd",authenticateUser,createMessage);
messageRouter.get("/getmessage/:conversationId",authenticateUser,getMessageByConversationId);


export default messageRouter;