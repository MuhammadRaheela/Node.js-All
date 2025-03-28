const exp = require("express")
const router = exp.Router()
const todoController = require("../Controller/todoController")
const authMiddleWear = require("../MiddleWear/authMiddleWear")

router.post("/create",authMiddleWear,todoController.createtodo)
router.get("/get",authMiddleWear,todoController.getAllTodo)
router.delete("/delete/:id",authMiddleWear,todoController.deleteTodo)



module.exports = router
