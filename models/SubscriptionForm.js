const mongoose =require("mongoose");

const SubscriptionFormSchema=new mongoose.Schema({
    planname:{
        type:String,
        required:true,
    },
    features:{
        type:String,
        required:true,
    },
    
},{timestamps:true})

module.exports=mongoose.model("SubscriptionForm",SubscriptionFormSchema);