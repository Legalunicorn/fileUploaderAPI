const {validationResult,body} = require("express-validator");
const asyncHandler = require("express-async-handler");
const upload = require("../config/multer")
const cloudinary = require("../config/cloudinary")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const myError = require("../lib/myError")
const {Readable} = require("stream")

/**
 * upload.single() is a multer middleware function 
 * takes in the name of the file
 */

 async function uploadStream(buffer,type) {
    return new Promise((res, rej) => {
      const theTransformStream = cloudinary.uploader.upload_stream(
        {
            folder:'top_file_uploader',
            resource_type:type

        },
        (err, result) => {
          if (err) return rej(err);
          res(result);
        }
      );
      let str = Readable.from(buffer);
      str.pipe(theTransformStream);
    });
  }



function getResourceType(mimetype){
    if (mimetype.startsWith("image/")) return 'image'
    else if (mimetype.startsWith("video/")) return 'video'
    else return 'raw'
}

function getFileExt(filename){
    const lastIndex = filename.lastIndexOf(".");
    if (lastIndex==-1) return 'unknown'
    else return filename.substring(lastIndex+1,).toLowerCase();
}


exports.postFile=[
    upload.single("image"),
    async(req,res,next)=>{
        try{
    
            const folderId = Number(req.body.folderId)
            console.log("req.file.path",req.file.path);
            console.log("/",req.file);

            const type = getResourceType(req.file.mimetype);

            const result = await uploadStream(req.file.buffer,type);
            console.log("sucess?",result);
            // const downloadUrl = cloudinary.url(result.public_id,{
            //     flags:"attachment:FileUploader"+req.file.originalname
            // })
            const fileExt = getFileExt(req.file.originalname);


            const file = await prisma.file.create({
                data:{
                    name:req.file.originalname,
                    extension: fileExt,
                    sizeMB: req.file.size,
                    path: result.secure_url,
                    public_id: result.public_id,
                    userId: req.user.id,
                    folderId: folderId,
                    downloadLink: result.secure_url //maybe remove this and set an endpoint to delete file
                    
                }
            })
            console.log("prisma: ",file)

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
        console.log("HEADERS: ",file.name, 'example.pdf')
        res.setHeader('Content-Disposition',`attachment;filename=${"example.pdf"}`)
        res.redirect(file.downloadLink); //should be succesful?
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