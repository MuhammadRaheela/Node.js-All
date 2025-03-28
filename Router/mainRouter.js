const exp = require("express")
const router = exp.Router()

const authRoter = require("./authRouter")
const todoRouter = require("./todoRouter")


router.use("/auth",authRoter)
router.use("/todo",todoRouter)


module.exports = router