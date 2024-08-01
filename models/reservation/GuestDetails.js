const mongoose =require("mongoose");

const GuestDetailsSchema=new mongoose.Schema({
   hotelId:{
      type:String,
      required:true
   },
   guestName:{
    type:String,
    required:true
   },
   guestEmail:{
    type:String,
    required:true
   },
   guestContact:{
    type:String,
    required:true,
   }
    
},{timestamps:true})

module.exports=mongoose.model("GuestDetails",GuestDetailsSchema);