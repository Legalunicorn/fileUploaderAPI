const multer = require("multer")
const storage = multer.memoryStorage()
// const upload = multer({storage:storage})
const upload = multer({dest:'uploads/'})
module.exports = upload;