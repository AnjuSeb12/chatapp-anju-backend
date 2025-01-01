import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";
const saltRound = 10;



export const userRegisteration = async (req, res) => {
    try {
        const { username, email, password,bio} = req.body;
     console.log(req.body.password)

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // checking exituser or not

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }
        // password bcrypt
        const hashedPass = await bcrypt.hash(password, saltRound);
        // create user
        const user = await User.create({
            username,
            email,
            password: hashedPass,
            bio
            

        });
        await user.save();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Registeration Failed!",
            })
        }
        res.status(201).json({
            message: 'User registered successfully.',
            
        });



    } catch (err) {
        res.status(500).json({
            message: 'Error registering user.', error: err.message
        });

    }


  





}
// user login

export const userLogin = async (req, res) => {
    try {
        const {email,password} = req.body;


        // required field
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found!"

            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
       
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials!',

            });
        }
        // update lastseen
        // user.lastSeen = new Date();
        // await user.save()
        


        const token = generateToken(user);


        res.cookie("token", token);
        res.status(201).json({
            success: true,
            message: "Loged in Successfully!",
            token,
            user: {
                id: user._id,
                username: user.username,
                
            }


        });


    } catch (error) {
        
        res.status(500).json({ 
            success:false,
            message: 'Error registering user.', error: error.message });

    }

}
export const updateUser=async (req,res)=>{
    try {
        const {id}=req.params.id;
        const updatedUser= await User.findByIdAndUpdate(id,req.body,{new:true})
        if(updateUser){
            res.status(200).json({
                message:"Updated successfully",
                updatedUser
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
        
    }
}


export const deleteUser=async (req,res)=>{
    try {
        const deleteUser=await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"Deleted Successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            error:error.message,
        })
        
    }
}

export const getUsers=async (req,res)=>{
    try {

        const userId=req.user.id;

        const users = await User.find({
            _id:{
                $nin:[userId]
                // $in:[userId]
            }
        })
        res.status(200).json({
            message:"Success",
            users
        })
        
    } catch (error) {

        
    }
}
