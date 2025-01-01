import http from "http"
import {Server} from "socket.io"
import NodeCache from "node-cache";
import express from 'express';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import cookieParser from "cookie-parser";
import cors from "cors"





const app=express()
app.use(cors({
    credentials:true,
    origin:true,
}));
app.use(cookieParser())


app.use(express.urlencoded({
    extended:true
}));


app.use(express.json());

const server=http.createServer(app)
const io=new Server(server)

const myCache = new NodeCache();
// myCache.set("key","value"); set data by using key 
// myCache.get("key"); get data by using key





io.on("connect",(socket)=>{
    console.log('Number of connected clients:',io.engine.clientsCount);
    console.log('A USER is CONNECTED',socket.id,socket.handshake.query.userId);
    const userId=socket.handshake.query?.userId;
    if (userId) {
      myCache.set(userId,socket.id);
    }else{
      socket.disconnect();
    }
    //eample 25 anju
    //23 id ajmal
    //server check ,aju online , by searching in cache
    //if he is found then use below syntx
    // io.to("aju socketId").emit("newMessage",message);

    io.emit("onlineUsers",myCache.keys())
    // io.emit("message","hai anju")
    // socket.emit("message",`Welcome to Socket${userId}`)
    // socket.emit("newmes","hey whatsup")
    


    io.on("disconnect",()=>{
        console.log("disconnected")
        myCache.del(userId);
    })
})

app.use("/api/v1/user",userRouter);
app.use("/api/v1/message",messageRouter)




app.use((err,req,res,next)=> {
    console.log(err.message);
});

export const getOnlineUserSocketIdByUserId=async (id)=>{
    try {
        let userSocketId = myCache.get(id)
        return userSocketId
        



        
    } catch (error) {
        return null
        
    }

}

export {app,server,io};