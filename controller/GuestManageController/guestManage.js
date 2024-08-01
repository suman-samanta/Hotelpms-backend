const GuestDetails = require("../../models/reservation/GuestDetails");
const RoomSetting = require("../../models/reservation/RoomSetting");

exports.searchPreviousGuest=async(req,res)=>{
    const guestName=req.params.guestName;
    const hotelId=req.params.hotelId;

    try{

        const result=await GuestDetails.find({ hotelId:hotelId,guestName: { $regex: new RegExp('^'+guestName+'.*','i') }}).exec()

        console.log(result)
        res.status(200).json(result)
        

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}


exports.searchPreviousGuestByContact=async(req,res)=>{
    const guestContact=req.params.guestContact;

    try{

        const result=await GuestDetails.findOne({ guestContact: { $regex: new RegExp('^'+guestContact+'.*','i') }}).exec()

        console.log(result)
        if(result){
            res.status(200).json("This Guest is previously registered")
        }else{
            res.status(200)
        }
        
        

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}