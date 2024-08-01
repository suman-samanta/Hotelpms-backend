const mongoose =require("mongoose");

const CheckInCheckOutSchema=new mongoose.Schema({
   
    refNo:{
        type:Number,
        required:true
    },
    billingGuestName:{
        type:String,
        required:true
    },
    guestContact:{
        type:String,
        required:true
    },
    guestEmail:{
        type:String,
        required:true
    },

    guestName:{
        type:String,
        required:true
    },

    hotelId:{
        type:String,
        required:true
    },
    roomNo:{
        type:String,
        required:true
    },
    checkIndate:{
        type:String,
        required:true
    },
    checkInStatus:{
        type:Boolean,
        required:true
    },
    checkOutDate:{
        type:String,
        required:true
    },
    checkOutStatus:{
        type:Boolean,
        required:true
    },
    advancePayment:{
        type:Number,
        required:true
    },
    fullPayment:{
        type:Number,
        required:true
    },
    remainingPayment:{
        type:Number,
        required:true
    },
    checkInBy:{
        type:String,
        required:true
    },
    updatedBy:{
        type:String,
        required:true
    },
    adult:{
        type:String,
        required:true
    },
    child:{
        type:String,
        required:true
    },

    isCanceled:{
        type:Boolean,
        default:false
    },
    fullPaymentComplete:{
        type:Boolean,
        default:false
    }

    
},{timestamps:true})

module.exports=mongoose.model("CheckInCheckOutTable",CheckInCheckOutSchema);