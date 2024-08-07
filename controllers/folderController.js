const {validationResult,body} = require("express-validator");
const asyncHandler = require("express-async-handler")
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient;


//pushing a file to a folder is a file operation
//deleting a file from a folder is also a file endpoint

exports.postFolder=[ //can
    body("name","Name is invalid")
        .trim()
        .isLength({min:1,max:30})
        .withMessage("Folder name 1-30 characters"),

    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).send({errors:errors.array()});
            return;
        }

        const folder = await prisma.folder.create({
            data:{
                name:req.body.name,
                userId:req.user.id
            }
        })

        res.status(200).json({folder});


    })
]


exports.getFolder= asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.folderId);
    console.log("getting: ",id)
    const folder = await prisma.folder.findUnique({
        where:{
            id:id
        }
    })

    if (!folder){
        res.status(404).send({error:`FOLDER:${id} does not exist`});
    }
    else{
        res.status(200).json({folder});
    }

})
/**
 * By design, only empty folders can be deleted
 */
exports.deleteFolder = asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.folderId)
    console.log("type of id",typeof id);

    //make sure that folder has no files
    const fileCount = await prisma.file.count({
        where:{
            folderId:id
        }
    })
    if(fileCount>0){
        throw new Error("Folders must be empty to be deleted")
    }
    else{
        const folder = await prisma.folder.delete({
            where:{
                id:id
            }
        })

        res.status(200).json({folder});
    }
    
})

//only for changing names
exports.patchFolder = [
    body("name","Name is invalid")
        .trim()
        .isLength({min:1,max:30})
        .withMessage("Folder name 1-30 characters"),

    asyncHandler(async(req,res,next)=>{
        const {name} = req.body; 
        const id = Number(req.params.folderId);

        //get the folder first
        const folder = await prisma.folder.findUnique({
            where:{
                id:id
            }
        })
        if (!folder){
            res.status(400).json({error:"No such folder to patch"})
            return;
        }
        else{
            if (folder.name===name){
                //no need to actually update anything
                res.status(200).json({folder});
                return;
            }
            const updatedFolder = await prisma.folder.update({
                where:{
                    id:id
                },
                data:{
                    name:name
                }
            })

            res.status(200).json({updatedFolder});
        }

    })
]

exports.getFolderFiles = asyncHandler(async(req,res,next)=>{
    //empty folder is not an error
    const id = Number(req.params.folderId);
    //404 if folder does not exist
    const folder = await prisma.folder.findUnique({
        where:{
            id:id
        }
    })
    if (!folder){
        res.status(404).json({error:"Folder does not exist"});
        return;
    }
    const files = await prisma.file.findMany({ //TODO combine both await into one promise.all()
        where:{
            folderId:id
        }
    })
    res.status(200).json({files});
})
