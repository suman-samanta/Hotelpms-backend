const mongoose =require("mongoose");

const TaskManagementSchema=new mongoose.Schema(
    {
        hotelId:{
            type:String,
            required:true
        },
        jobId:{
           type:Number,
           required:true
        },
        roomNo:{
            type:Number,
            required:true
        },
        task:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        assigned:{
            type:String,
            required:true
        },
        remarks:{
            type:String  
        },
        cost:{
            type:Number
        },
        taskStatus:{
            type:Boolean,
            required:true,
            default:false
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


module.exports=mongoose.model("TaskManagement",TaskManagementSchema);