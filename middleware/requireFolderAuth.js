const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler")
const prisma = new PrismaClient();
const myError = require("../lib/myError")

const requireAuth = require("./requireAuth")

const requireFolderAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const id = Number(req.params.folderId)
        const folder = await prisma.folder.findUnique({
            where:{
                id:id
            }
        })

        if (!folder){
            throw new myError(`Folder with ID:${id} does not exist.`,400)
            // throw new Error(`File with ID:${req.parans.fileId} does not exist.`)
        }
        if (folder.userId!=req.user.id){ //user does not own the file
            throw new myError(`USER:${req.user.id} does not have authorization to FOLDER:${folder.id}`,401);
        }
        next();


    })
]




module.exports = requireFolderAuth;
