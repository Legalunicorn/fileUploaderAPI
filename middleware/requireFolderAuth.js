const {PrismaClient} = require("@prisma/client");
const asyncHandler = require("express-async-handler")
const prisma = new PrismaClient();

const requireAuth = require("./requireAuth")

const requireFolderAuth = [
    requireAuth,
    asyncHandler(async(req,res,next)=>{
        const folder = await prisma.folder.findUnique({
            where:{
                id:req.params.folerId
            }
        })

        if (!folder){
            throw new myError(`Folder with ID:${req.parans.fileId} does not exist.`,400)
            // throw new Error(`File with ID:${req.parans.fileId} does not exist.`)
        }
        if (folder.userId!=req.user.id){ //user does not own the file
            throw new myError(`USER:${req.user.id} does not have authorization to FOLDER:${folder.id}`,401);
        }
        next();


    })
]




module.exports = requireFolderAuth;
