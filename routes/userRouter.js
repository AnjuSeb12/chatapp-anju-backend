import express from "express"
import { deleteUser, getUsers, updateUser, userLogin, userRegisteration } from "../controllers/userController.js"
import authenticateUser from "../middlewares/usermiddleware.js"
import jwt from "jsonwebtoken"





const userRouter = express.Router()


userRouter.get('/auth/validate', (req, res) => {
  console.log("hitted validater")
  const token = req.cookies.token;
  console.log("checking", token) // Get the token from the cookie
  if (!token) {
    console.log("if block is executing");

    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'chatapplicationANJUs123456nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnniiiiiiii');

    res.status(200).json({
      success: true,
      message: "Authorized",
      user: decoded,

    })
  } catch (err) {
    res.status(402).json({ valid: false, error: 'Invalid Token' });
    console.log("error", err.message)
  }
});





userRouter.post("/signup", userRegisteration)
userRouter.post("/login", userLogin)
userRouter.put("/updateuser/:id", updateUser)
userRouter.delete("/deleteuser/:id", deleteUser)
userRouter.get("/getuser", authenticateUser, getUsers)


export default userRouter;