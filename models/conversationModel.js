import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    participantsId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        

    }],
    conversationType:{

        type:String,
        enum:["Normal","Group"],
        default:"Normal"
    },
    groupImage:{
        type:String,
        
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    groupAdmins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],



},
{ timestamps: true }
);
const Conversation=mongoose.model("Conversation",conversationSchema)
export default Conversation



