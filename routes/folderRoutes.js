const router = require("express").Router();
const controller = require("../controllers/folderController")
const requireAuth= require("../middleware/requireAuth")
const requireFolderAuth = require("../middleware/requireFolderAuth")
const parseParamsId = require("../middleware/parseParamsId")

//define endpoints

// router.use(/^\/$/,requireFolderAuth)
// 
// router.use(parseParamsId); //parse all my Ids to integers

router.post("/",
    requireAuth,
    controller.postFolder) //DONE

router.get("/:folderId",
    requireFolderAuth,
    controller.getFolder)

router.delete("/:folderId",
    requireFolderAuth,
    controller.deleteFolder)

router.patch("/:folderId",
    requireFolderAuth,
    controller.patchFolder
)

module.exports = router