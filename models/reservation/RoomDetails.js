const mongoose =require("mongoose");

const RoomDetailsSchema=new mongoose.Schema({
    roomType:{
        type:String,
        required:true
    },
    
    ratePlan:{
        type:String,
        required:true,
        
    },
    roomNo:{
        type:Number,
        required:true,
        unique:true
    },
    rateCharges:{
        type:Number,
        required:true
    }
    
    
},{timestamps:true})

module.exports=mongoose.model("RoomDetails",RoomDetailsSchema);