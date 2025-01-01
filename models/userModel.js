import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
           
            trim: true,
            
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            
        },
        password: {
            type: String,
            
            

        },
        profilePicture: {
            type: String,
            default: null
        },
        lastSeen: {
            type: Date,
            default: null
        },
        bio: {
            type: String,
            trim: true,
            maxLength: 160
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        googleId:{
            type:String,
            unique:true,
            sparse:true
            // sparse expalin 
            
        },
        authProvider:{
            type:String,
            enum:['google','local'],
            default:'local',
            // index:true

        }


    },
    { timestamps: true }
);

userSchema.index({username:1})
const User = mongoose.model("User", userSchema);

export default User;