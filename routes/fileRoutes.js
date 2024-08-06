const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth")
const requireFolderAuth = require("../middleware/requireFolderAuth")
const controller = require("../controllers/fileController")

router.post("/",
    requireAuth,
    controller.postFile)
// router.get("/:fileId")
// router.get("/:fileId/content")

// router.delete("/:fileId")
// router.patch("/file/:fileId")

module.exports = router