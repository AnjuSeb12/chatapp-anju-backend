import express from "express"
import { createMessage, getAllConversationBySenderId, getLatestMessageByConversationId} from "../controllers/messageController.js";
import authenticateUser from "../middlewares/usermiddleware.js";


const messageRouter=express.Router()


messageRouter.post("/messageadd",authenticateUser,createMessage);
messageRouter.get("/getmessage/:conversationId",authenticateUser,getLatestMessageByConversationId);
messageRouter.get("/getmessage/",authenticateUser,getAllConversationBySenderId);


export default messageRouter;