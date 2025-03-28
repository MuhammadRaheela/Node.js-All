const exp = require("express")
const router = exp.Router()
const authController = require("../Controller/authController")
const authMiddlewear = require("../MiddleWear/authMiddleWear");

const multer = require("multer")

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.post("/signup",authController.signup)
router.post("/verifyotp", authMiddlewear, authController.verifyotp);
router.post('/completeprofile',authMiddlewear,upload.single("Image"),authController.completeprofile)
router.post("/login",authController.login)


module.exports = router


