const titleValidate = require("../Validater/todoValidate");
const todoModel = require("../Models/todoModel");

exports.createtodo = async (req, res) => {
  try {
    const todocheck = await titleValidate.validate(req.body);

    if (todocheck.error) {
      console.log(todocheck.error.details[0].message);
      return res.status(400).json({
        message: todocheck.error.details[0].message,
        status: false,
      });
    }

    req.body.userId = req._id;

    var todo = todoModel(req.body);
    todo.save();

    return res.status(200).json({
      message: "Save data",
      data: todo,
    });
  } catch (e) {}
};

exports.getAllTodo = async (req, res) => {
  try{
   console.log(req._id);
   const todo = await todoModel.find({userId:req._id})
   return res.status(200).json({
    message:"GET ALL TODOS...",
    data:todo
   })
  }catch(e){

  }
}

exports.deleteTodo=async (req,res)=>{
  try{
    console.log((req.params));
    
    return res.status(200).json({
      message:"deleteTODO"
    })
    
  }catch(e){

  }
}