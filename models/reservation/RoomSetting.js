const mongoose =require("mongoose");

const RoomSettingSchema=new mongoose.Schema({
    roomType:{
        type:String,
        required:true,
    },
    
    // ratePlan:{
    //     type:String,
    //     required:true,
    // },
    roomNo:{
        type:Number,
        required:true
    },
    rateCharges:{
        type:Number,
        required:true
    },
    roomFloor:{
        type:String,
        required:true
    },
    roomName:{
        type:String
    },
    createdBy:{
        type:String,
        required:true
    },
    hotelId:{
        type:String,
        required:true
    },

    roomAvalability:[
        {
        roomAvailableId:Number,
        operationStartDate:String,
        operationCompleteDate:String,
        roomStatus:String,
        roomAvailable:Boolean,
        name:String,        
        }
    ]
},{timestamps:true})

module.exports=mongoose.model("RoomSetting",RoomSettingSchema);

// {
//     type:Object,
//     operationStartDate:String,
//     operationCompleteDate:String,
//     roomStatus:String,
//     roomAvailable:Boolean
// }