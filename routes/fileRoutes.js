const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth")
const requireFileAuth = require("../middleware/requireFileAuth")
const controller = require("../controllers/fileController")

router.post("/",
    requireAuth,
    controller.postFile)

router.get("/:fileId",
    requireFileAuth,
    controller.getFileMeta
)
router.get("/:fileId/content",
    requireFileAuth,
    controller.getFileContent
)

// router.delete("/:fileId")
router.patch("/:fileId",
    requireFileAuth,
    controller.patchFile
)

router.delete("/:fileId",
    requireFileAuth,
    controller.deleteFile
)

module.exports = router