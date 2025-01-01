import Message from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js"
import { getOnlineUserSocketIdByUserId } from "../app.js";
import { io } from "../app.js";


export const createMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content, type } = req.body;

        let conversation = await Conversation.findOne({
            participantsId: { $all: [senderId, receiverId] },
            conversationType: 'Normal',
        })

        if (!conversation) {
            conversation = new Conversation({
                participantsId: [senderId, receiverId],
                conversationType: 'Normal',
                createdBy: senderId,
            })
            await conversation.save();
        }
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            content,
            type,
        })
        await newMessage.save()
        const receiverSocketId=await getOnlineUserSocketIdByUserId(receiverId)
        if(receiverSocketId){
            
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }


        res.json({
            messahe: "Success",
            newMessage,
            conversation
        })



    } catch (error) {

        return res.status(500).json({
            message: 'Error sending message',
            error: error.message
        })

    }
}
export const getMessageByConversationId=async (req,res)=>{
    try {
        console.log("hitted")
        const {conversationId} = req.params;
        if(!conversationId){
            return res.status(400).json({
                success:false,
                message:"conversationId is required"
            })
        }
        const getConversationId=await Conversation.findById(conversationId)
       
        if(!conversationId){
            return res.status(404).json({
                success:false,
                message:"Conversation Not Found ",

            })
        }

        
        const messages=await Message.find({conversationId})
        .sort({ createdAt: 1 });
        res.status(200).json({
            success:true,
            message:"found message",
            messages
        })
        return res.status(400).json({
            success:false,
            message:"Not found message "
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error retrieving messages",
            error:error.message
        })
        
    }
}
