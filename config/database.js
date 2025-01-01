import mongoose from 'mongoose';



const connectDb=async ()=>{
    try {
    await mongoose.connect(process.env.DB_URI);
    console.log('mongodb connected')

        
    } catch (error) {
        console.log("Error",error)
        
    }
 


}
export default connectDb;