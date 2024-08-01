const mongoose =require("mongoose");

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
        minlength:10
    },
    role:{
        type:String,
    }
    
},{timestamps:true})

module.exports=mongoose.model("User",UserSchema);