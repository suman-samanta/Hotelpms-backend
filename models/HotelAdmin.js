const mongoose =require("mongoose");

const HotelAdminSchema=new mongoose.Schema({

    ownername:{
        type:String,
        required:true
    },

    hotelname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    gst:{
        type:String,
        required:true,
        unique:true,
        minlength:15
    },


    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:Number,
        required:true,
        minlength:10
    },
    password:{
        type:String,
        required:true,
    },
    contract_path:{
        type:String,
        required:true
    },
    subscriptionDate:{
        type:String,
        required:true
    },
    expiryDate:{
        type:String,
        required:true
    },

    selectedPlan:{
        type:String,
        required:true,
    },
    
    role:{
        type:String,
    }
    
},{timestamps:true})

module.exports=mongoose.model("HotelAdmin",HotelAdminSchema);