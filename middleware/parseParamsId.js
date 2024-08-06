//this is useless
//req.params is only available in th eroute which has actuallt declaried paramsters to be put there
//you can just use router.use(thismiddleare)


const parseParamsId = (req,res,next) =>{
    console.log("in parse id =========")
    console.log("params are: ",req.params)
    if (req.params.folderId){
        req.params.folderId = Number(req.params.folderId)

        console.log('%^%^%', typeof req.params.folderId)
        next()
    }
    else if (req.params.fileId){
        req.params.fileId = Number(req.params.folderId)
        next()
    }
    next();
}

module.exports = parseParamsId;