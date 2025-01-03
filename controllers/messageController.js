import Message from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js"
import { getOnlineUserSocketIdByUserId } from "../app.js";
import { io } from "../app.js";
import User from "../models/userModel.js";



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


        res.status(200).json({
            message: "Successfully created message with that conversation id",
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


export const getLatestMessageByConversationId = async (req, res) => {
  try {
    console.log("hitted");
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

   
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation Not Found",
      });
    }

 
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name"); 

    if (!messages.length) {
      return res.status(404).json({
        success: false,
        message: "No messages found for this conversation",
      });
    }

 
    const latestMessage = messages[messages.length - 1];

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      messages, 
      latestMessage: {
        content: latestMessage.content,
        senderName: latestMessage.sender.name,
        date: latestMessage.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving messages",
      error: error.message,
    });
  }
};








export const getAllConversationBySenderId = async (req, res) => {
  try {
    const senderId = req.user.id;

   
    const conversations = await Conversation.find({ participantsId: senderId })
      .populate('participantsId', 'username') 
      .sort({ updatedAt: -1 }) 
      .lean();

    if (!conversations.length) {
      return res.status(404).json({
        success: false,
        message: 'No conversations found.',
      });
    }

  
    const formattedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const latestMessage = await Message.findOne({ conversationId: conversation._id })
          .sort({ createdAt: -1 }) 
          .lean();

        const receiver = conversation.participantsId.find(
          (user) => user._id.toString() !== senderId
        );

        return {
          receiverName: receiver?.username || 'Unknown',
          latestMessage: latestMessage?.content || 'No messages yet',
          updatedAt: conversation.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formattedConversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message,
    });
  }
};
