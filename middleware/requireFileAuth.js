const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler")
const prisma = new PrismaClient();
const myError = require("../lib/myError")
const requireAuth = require("./requireAuth")

const requireFileAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const id = Number(req.params.fileId) //BUG since its already here, i dont need it for 
        //controllers if i just assign req.params.fileId to be this new id
        const file = await prisma.file.findUnique({
            where:{
                id:id
            }
        })
        if (!file){
            throw new myError(`File with ID:${id} does not exist.`,400)
            // throw new Error(`File with ID:${req.parans.fileId} does not exist.`)
        }
        if (file.userId!=req.user.id){ //user does not own the file
            throw new myError("User does not have authorization to file",401);
        }
        next();
    })
]

module.exports = requireFileAuth;
