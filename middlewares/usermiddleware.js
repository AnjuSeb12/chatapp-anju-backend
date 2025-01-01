import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv"



dotenv.config()


function authenticateUser(req, res, next) {

    const token = req.cookies.token;
    console.log("token", token)
    jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next();
    })

}
export default authenticateUser