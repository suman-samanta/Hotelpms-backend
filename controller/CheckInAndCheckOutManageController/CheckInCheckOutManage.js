const CheckInAndCheckoutTable=require("../../models/checkInAndCheckOutTable/CheckInAndCheckoutTable");
const HouseKeepingMaster = require("../../models/houseKeeping/HouseKeepingMaster");
const ReservationDetails = require("../../models/reservation/ReservationDetails");




exports.CreateNewCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {refNo,roomNo,checkIndate,checkOutDate,billingGuestName,guestName,guestEmail,guestContact,
        advancePayment,fullPayment,remainingPayment,checkInBy,adult,child}=req.body;
    try{
         const newCheckIn=new CheckInAndCheckoutTable({
            
            refNo,
            hotelId,
            billingGuestName,
            guestName,
            guestEmail,
            guestContact,
            roomNo,
            checkIndate,
            checkInStatus:true,
            remainingPayment:Number(remainingPayment),
            checkOutDate,
            checkOutStatus:false,
        advancePayment:Number(advancePayment),
        fullPayment:Number(fullPayment),checkInBy,
        updatedBy:checkInBy,
        adult:adult,
        child:child
        });

        const savedCheckIn= await newCheckIn.save();
       
        res.status(200).json(savedCheckIn);

    }catch(err){
        res.status(401).json(err);
    }
}

exports.updateCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const checkInId=req.params.checkInId;

    const{roomNo,checkInDate,checkInStatus,checkOutDate,checkOutStatus,advancePayment,updatedBy}=req.body;

    try{

        const result=await CheckInAndCheckoutTable.updateOne({hotelId:hotelId,checkInId:checkInId},{
            $set:{
                roomNo:roomNo,
                checkIndate:checkInDate,
                checkOutDate:checkOutDate,
                checkInStatus:checkInStatus,    
                checkOutStatus:checkOutStatus,
                advancePayment:advancePayment,
                updatedBy:updatedBy
            }
        },{new:true});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.CheckInCancel=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const checkInId=req.params.checkInId;

    const isCanceled=true;

    try{
        const result=await CheckInAndCheckoutTable.updateOne({hotelId:hotelId,checkInId:checkInId},{
            $set:{isCanceled:isCanceled}
        });

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getCheckInBySearching=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {searchInput}=req.body;
    try{
        const checkInresByContact=await CheckInAndCheckoutTable.find({hotelId:hotelId,guestContact:searchInput,checkInStatus:true,checkOutStatus:false});
        if(checkInresByContact.length>0){
            res.status(200).json(checkInresByContact);
        }else if(checkInresByContact.length==0){
        const checkInresByGuestName=await CheckInAndCheckoutTable.find({hotelId:hotelId,billingGuestName:searchInput,checkInStatus:true,checkOutStatus:false});
           res.status(200).json(checkInresByGuestName);
        }
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getCheckInBySearchingRoomNo=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {roomNo}=req.body;
    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,roomNo:roomNo,checkInStatus:true,checkOutStatus:false});
        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.CheckOutARoom=async(req,res)=>{
    const checkInId=req.params.checkInId;
    const {updatedBy}=req.body;

    try{
        const result=await CheckInAndCheckoutTable.findByIdAndUpdate(checkInId,{
            $set:{
                checkInStatus:false,
                checkOutStatus:true,
                isCanceled:true,
                updatedBy:updatedBy
            }
        },{new:true});
                                                                                                                                                                                                                                                                                                                                      
        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}



exports.searchInCheckOut=async(req,res)=>{
    
    const hotelId=req.params.hotelId;
    const {searchInput}=req.body;

    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,isCanceled:true,guestContact:searchInput})

        if(result.length>0){
            res.status(200).json(result)
        }else{
            try{
            const searchres=await CheckInAndCheckoutTable.find({hotelId:hotelId,isCanceled:true,billingGuestName:searchInput})
            res.status(200).json(searchres);
            }catch(err){
                res.status(401).json(err);
            }
            
        }
    }catch(err){
        res.status(500).json(err);
    }
}

exports.reCheckInRoom=async(req,res)=>{
    const checkInId=req.params.checkInId;
    const {updatedBy,roomNo,checkOutDate,advancePayment,remainingPayment}=req.body;
    try{
        const result=await CheckInAndCheckoutTable.findOneAndUpdate({_id:checkInId,isCanceled:true},{
            $set:{
                isCanceled:false,
                checkInStatus:true,
                checkOutStatus:false,
                updatedBy:updatedBy,
                roomNo:roomNo,
                checkOutDate:checkOutDate,
                advancePayment:advancePayment,
                remainingPayment:remainingPayment
            }
        },{new:true})

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.getActiveCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,isCanceled:false});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getAllCheckOut=async(req,res)=>{
    const hotelId=req.params.hotelId;
    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,isCanceled:true});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getCheckInOnSpecificDate=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {checkInDate}=req.body;
    // console.log(req)
    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,isCanceled:false,checkIndate:checkInDate});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getAllreservationsToCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    try{
        const result=await ReservationDetails.find({hotelId:hotelId,isCheckedIn:false})

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.roomShiftingAfterCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const Id=req.params.Id;
    const {roomNo,updatedBy}=req.body;
    try{

        const getFirstRoom=await CheckInAndCheckoutTable.findById(Id);
        console.log(getFirstRoom.roomNo);
        const firstRoomNo=getFirstRoom.roomNo;
        const roomTobeShift=await CheckInAndCheckoutTable.findByIdAndUpdate(Id,{
            $set:{
                roomNo:roomNo,
                updatedBy:updatedBy
            }
        },{new:true});

        const leftRoom=await HouseKeepingMaster.findOneAndUpdate({hotelId:hotelId,roomNo:firstRoomNo},{
            $set:{
                roomStatus:"review",
                report:"Room Is Not Available for Check In",
                updatedBy:updatedBy
            }
        },{new:true})


        const updatedHouseKeeping=await HouseKeepingMaster.findOneAndUpdate({hotelId:hotelId,roomNo:roomNo},{
            $set:{
                roomStatus:"CheckedIn",
                report:"Room Is Not Available for Check In",
                updatedBy:updatedBy
            }
        },{new:true})


        res.status(200).json({roomTobeShifted:roomTobeShift,
        updatedHouseKeeping:updatedHouseKeeping,
    leftRoom:leftRoom});
    }catch(err){
        res.status(401).json(err);
    }
}


exports.getTotalBillAfterCheckOut=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const refNo=req.params.refNo;

    try{
        const getCheckIn=await CheckInAndCheckoutTable.find({hotelId:hotelId,refNo:refNo});

        console.log(getCheckIn);
        const roomNo=[];
        for(var i=0;i<getCheckIn.length;i++){
            roomNo[i]=getCheckIn[i].roomNo
        }

        const totalBill={
            refNo:getCheckIn[0].refNo,
            billingGuestName:getCheckIn[0].billingGuestName,
            guestEmail:getCheckIn[0].guestEmail,
            roomNo:roomNo,
            advancePayment:getCheckIn[0].advancePayment,
            fullPayment:getCheckIn[0].fullPayment,
            remainingPayment:getCheckIn[0].remainingPayment
        }
       res.status(200).json(totalBill);

    }catch(err){
        res.status(401).json(err);
    }
}

exports.completeFullPayment=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const refNo=req.params.refNo;

    try{
        const result=await CheckInAndCheckoutTable.updateMany({hotelId:hotelId,refNo:refNo},{
            $set:{
                fullPaymentComplete:true
            }
        },{new:true});

        const updatedRes=await CheckInAndCheckoutTable.find({hotelId:hotelId,refNo:refNo})

        res.status(200).json(updatedRes);

    }catch(err){
        res.status(401).json(err);
    }
}


exports.getActiveCheckInByMobileNo=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {guestContact}=req.body;

    try{
        const result=await CheckInAndCheckoutTable.find({hotelId:hotelId,guestContact:guestContact,isCanceled:false});
        console.log(result)
        const rooms=[];
        for(var i=0;i<result.length;i++){
            rooms[i]=result[i].roomNo;
        }

        if(result.length>0){
            const activeCheckIn={
            refNo: result[0].refNo,
            billingGuestName:result[0].billingGuestName,
            guestContact: result[0].guestContact,
            guestEmail: result[0].guestEmail,
            rooms:rooms,
            checkIndate: result[0].checkIndate,
            checkOutDate: result[0].checkOutDate,
            advancePayment: result[0].advancePayment,
            fullPayment: result[0].fullPayment,
            remainingPayment: result[0].remainingPayment
            }
    
    
            res.status(200).json(activeCheckIn);
        }else{
            res.status(200).json("There Is No Active checkIn With this Number");
        }
        
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
}

