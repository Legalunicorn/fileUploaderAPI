const {validationResult,body} = require("express-validator");
const asyncHandler = require("express-async-handler");
const upload = require("../config/multer")
const cloudinary = require("../config/cloudinary")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const myError = require("../lib/myError")

/**
 * upload.single() is a multer middleware function 
 * takes in the name of the file
 */
exports.postFile=[
    upload.single("image"),
    async(req,res,next)=>{
        try{
    
            const folderId = Number(req.body.folderId)
            console.log("req.file.path",req.file.path);
            console.log("/",req.file);

            //trying to figure out while file.path is undefined
            const result = await cloudinary.uploader.upload(req.file.path,{
                folder:'top_file_uploader'
            });
            // console.log("sucess?",result);
            const file = await prisma.file.create({
                data:{
                    name:req.file.originalname,
                    extension:result.format,
                    sizeMB: req.file.size,
                    path: result.secure_url,
                    public_id: result.public_id,
                    userId: req.user.id,
                    folderId: folderId,
                }
            })

            res.status(200).json({file});
        } catch(err){
            console.log(err)
            console.log(err.stack)
            throw new myError("Error uploading to cloudinary",500)       
        }
    }
]

//file data is in the query
exports.getFileMeta = asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.fileId);
    const file = await prisma.file.findUnique({
        where:{
            id:id
        }
    })
    if (!file){
        res.status(404).json({error:"Files does not exist"});
        return;
    }
    else{
        res.status(200).json({file});
        return;
    }
})

/**
 * Only thing changable is the FILE NAME
 */
exports.patchFile = [
    body("file_name")
        .trim()
        .isLength({min:1,max:300}),
    
    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new myError("File name must be between 1-300 charactes long",400);

        //carry out patch requires

        const id = Number(req.params.fileId)
        //see if file exist
        const exist = await prisma.file.findUnique({
            where:{
                id:id
            }
        })
        if (!exist){
            res.status(404).json({error:"File not found for PATCH requst"})
            return;
        }
        else{
            const file = await prisma.file.update({
                where:{
                    id:id
                },
                data:{
                    name:req.body.name
                }
            })

            res.status(200).json({file});
        }
    })
]

exports.getFileContent= asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.fileId);
    //check if file exist
    const file = await prisma.file.findUnique({
        where:{
            id:id
        }
    })
    if (!file){
        res.status(404).json({error:"File does not exist."})
        return;
    } else{
        res.download(file.path,file.name); //should be succesful?
    }
})

exports.deleteFile = asyncHandler(async(req,res,next)=>{
    const id = Number(req.params.fileId);
    const exist = await prisma.file.findUnique({
        where:{id:id}
    })
    if (!exist){
        res.status(404).json({error:"File does not exist"});
        return;
    } else{
        //TODO reface this ti make it promose .all

        const [file,result] = await Promise.all([
            prisma.file.delete({where:{id:id}}),
            cloudinary.uploader.destroy(exist.public_id)

        ])
        console.log("Results of file deletion",result);

        return res.status(200).json({file});

    }
})