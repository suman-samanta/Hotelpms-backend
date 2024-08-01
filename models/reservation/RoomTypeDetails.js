const mongoose =require("mongoose");

const RoomTypeSchema=new mongoose.Schema({
    hotelId:{
        type:String,
        required:true
    },
    roomType:{
        type:String,
        required:true
    },
    
},{timestamps:true})

module.exports=mongoose.model("RoomTypeDetails",RoomTypeSchema);