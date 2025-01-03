import mongoose from "mongoose";


const mesSchema=new mongoose.Schema(
    {
         conversationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Conversation',
                    required: true,
                },
                seenBy:[{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                }],
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                content: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    enum: ['text', 'image', 'video', 'audio', 'file'],
                    default: 'text',
                },
                status: {
                    type: String,
                    enum: ['sent', 'delivered', 'read'],
                    default: 'sent',
                },
                mediaUrl: {
                    type: String,
                    default: null
                },
                deletedBy: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                ],
        

    },
    { timestamps: true }

);
const Message = mongoose.models.Message || mongoose.model('Message', mesSchema);
export default Message

