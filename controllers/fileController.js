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