import {app,server} from "./app.js"
import dotenv from 'dotenv';
import connectDb from "./config/database.js"


dotenv.config();


connectDb();

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})