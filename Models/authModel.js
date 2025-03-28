
const mongoose = require("mongoose")


const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true
    },
    verify:{
        type:Boolean,
        required:false,
        default:false
    },
    otpCode:{
        type:String,
        required:true,
        default:""
    },
     profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
        required: false,
      },
   
})

module.exports = mongoose.model("regsister",authSchema)