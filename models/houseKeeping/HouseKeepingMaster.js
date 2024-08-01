const mongoose =require("mongoose");

const HouseKeepingMasterSchema=new mongoose.Schema(
    {
        hotelId:{
            type:String,
            required:true
        },
        roomType:{
            type:String,
            required:true
        },
        roomNo:{
            type:Number,
            required:true
        },
        roomStatus:{
            type:String,
            required:true
        },
        cleaningDate:{
            type:String,
            required:true
        },
        assigned:{
            type:String,
            required:true
        },
        report:{
            type:String
            
        },
        createdBy:{
            type:String,
            required:true
        },
        updatedBy:{
            type:String,
            required:true
        }
    }
,{timestamps:true})


module.exports=mongoose.model("HouseKeepingMaster",HouseKeepingMasterSchema);