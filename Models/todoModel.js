const mongoose = require("mongoose")


const todomodel = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","delete","inpocess"],
        default:"pending"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"register",
        required: true
    }
})

module.exports = mongoose.model("Todo",todomodel)