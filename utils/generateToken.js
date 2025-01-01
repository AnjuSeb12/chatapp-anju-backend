import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();


const secret_key = process.env.SECRET_KEY;


 export const generateToken = (user) => {
  return jsonwebtoken.sign({ id: user.id}, secret_key, { expiresIn: "1d" });
  

};