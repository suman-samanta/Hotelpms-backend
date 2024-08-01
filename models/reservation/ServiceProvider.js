const mongoose =require("mongoose");

const ServiceProviderSchema=new mongoose.Schema({
    // bookingsource:{
    //     type:String,
    //     required:true,
    //     unique:true,
    //     Enum:["OTA","Travel Agent","Booking Engine"],
    // },

    OTA:{
        type:Array,
        null:true
    },

    TravelAgent:{
        type:Array,
        null:true
    },
    BookingEngine:{
        type:Array,  
        null:true,
        required:false
    }
    
},{timestamps:true})

module.exports=mongoose.model("ServiceProvider",ServiceProviderSchema);