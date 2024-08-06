const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler")
const prisma = new PrismaClient();
const myError = require("../lib/myError")

const requireAuth = require("./requireAuth")

const requireFileAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const file = await prisma.file.findUnique({
            where:{
                id:req.params.fileId
            }
        })

        if (!file){
            throw new myError(`File with ID:${req.parans.fileId} does not exist.`,400)
            // throw new Error(`File with ID:${req.parans.fileId} does not exist.`)
        }
        if (file.userId!=req.user.id){ //user does not own the file
            throw new myError("User does not have authorization to file",401);
        }
        next();


    })
]




module.exports = requireFileAuth;
