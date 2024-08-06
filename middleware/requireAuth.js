/*
PSEUDOCODE
- get auth from req.headers.auth
- if auth does no exist -> throw error
- get token <- auth
- jwt.hasError, id
- jwt.verify
- if jwtError -> return 

- populate req.user -> User.find()
*/

const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler")
const prisma = new PrismaClient();


const requireAuth = asyncHandler(async(req,res,next)=>{
    const auth = req.headers.authroization;
    if (!auth){
        res.status(401).json({error:"Auth Token required"})
        return
    }
    const token = auth.split("")[1];

    let id,jwtError=false;
    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        if (err){
            jwtError=true;
            console.log(err);
            //TODO account for jwt expired and send a difference status code 
        }else id = decoded.id; //id stored in the token
    })

    if (jwtError){
        res.status(401).json({error:"An error has occured with the token"});
        return;
    }

    //No issues
    req.user = await prisma.user.findUnique({
        where:{
            id:id
        }
    })

})


module.exports = requireAuth;
