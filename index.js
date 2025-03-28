const exp = require("express")
const app = exp()
const port = 5000
const bodyParser = require('body-parser')
const cors = require("cors")
const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'diezy8w37', 
  api_key: '191475218481229', 
  api_secret: "NHLfoxiyLPO33bikOIWjgnzpgv4"
});

require("dotenv").config()
mongoose.connect(process.env.ConnectionString)
const db = mongoose.connection

db.once("open",()=>{
  console.log("MONGODB CONNECT")  
})

db.once("error",()=>{
  console.log("error");
})

// Middleware order fix
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));


// Router import
const main = require("./Router/mainRouter");
app.use(main)




app.listen(port ,()=>{
  console.log(`Server has been runed ${port}`);
})










// app.get("/user" , (req,res)=>{
//   res.status(200).json({
//     message:"get",
//     "name":"Muhammad Raheel"
//   })
//   console.log("HELLO")
// })





// app.post("/" , (req,res)=>{
//   res.send("Hello POST")
//   const {email,name,father} =req.body
//   console.log(email,name,father);  
//   console.log("HELLO")
// })

