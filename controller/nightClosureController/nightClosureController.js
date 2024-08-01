const ReservationDetails = require("../../models/reservation/ReservationDetails");



exports.getReservationThatNotCheckedIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const todayDate=new Date();

    console.log(todayDate);
    try{
        const result=await ReservationDetails.find({hotelId:hotelId,isCheckedIn:false,checkInDate:{$lt:todayDate}})

        res.status(200).json(result);   
    }catch(err){
        res.status(500).json(err);
    }
}