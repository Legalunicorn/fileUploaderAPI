const router = require("express").Router();
const controller = require("../controllers/folderController")

//define endpoints
router.post("/")
router.get("/:folderId")
router.delete("/:folderId")
router.patch("/:folderId")

module.exports = router