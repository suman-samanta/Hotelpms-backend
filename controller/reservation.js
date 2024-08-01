const { json } = require("express");
const HotelAdmin=require("../models/HotelAdmin");
const ReservationDetails=require("../models/reservation/ReservationDetails");
const RoomDetails=require("../models/reservation/RoomDetails")
const ServiceProvider=require("../models/reservation/ServiceProvider")
const nodemailer=require("nodemailer")
const ejs = require('ejs');
const fs = require("fs");
const pdf = require("html-pdf");
const {ObjectId} = require('mongodb');
const moment=require("moment");
const path = require("path");

const RoomTypeDetails = require("../models/reservation/RoomTypeDetails");
const RoomSetting = require("../models/reservation/RoomSetting");
const GuestDetails=require("../models/reservation/GuestDetails");
const HouseKeepingMaster = require("../models/houseKeeping/HouseKeepingMaster");

exports.createNewReservation=async(req,res)=>{
    
    const{hotelId,hotelAdminEmail,guestEmail,guestContact,roomInfo,
        advancePayment,lastPayment,totalPrice,roomCharges,tax,paymentMode,bookingInfo,agent,bookingType,
    checkInDate,checkOutDate,nights,taxInc,billingUser,billingGuestName}=req.body;




    const lastElm=await ReservationDetails.find().sort({_id:-1}).limit(1)
    
    let refNo;
    let RefNo;
    if(lastElm.length===0){
      refNo=1;
    }else{
     RefNo=JSON.parse(JSON.stringify(lastElm))
      refNo=RefNo[0].refNo+1
    }

  
    const hotelAdmin=await HotelAdmin.find({email:hotelAdminEmail})

    console.log(hotelAdmin);
    console.log(hotelAdmin[0].hotelname)

    const roomInformation=JSON.parse(roomInfo)

    // console.log(roomInformation[0])
    // if(!guestName){
    //    return  res.status(401).json("Please Enter Guest Name")
    // }

    if(!guestEmail){
       return res.status(401).json("Please Enter the Email id")
    }

    if(!guestContact){
     return  res.status(401).json("Please Enter the Contact No")
    }

    if(!roomInfo){
      return  res.status(401).json("Please Enter the Room Information")
    }

    if(!lastPayment){
       return res.status(401).json("last Payment is required")
    }

    if(!totalPrice){
       return res.status(401).json("Total Price is required")
    }
    if(!bookingInfo){
      return  res.status(401).json("Please Enter the booking Info")
    }

    if(!paymentMode){
       return res.status(401).json("Please Enter the payment mode")
    }

    if(!agent){
       return res.status(401).json("Please Enter the agent name")
    }
    if(!bookingType){
      return  res.status(401).json("Please Enter the booking status")
    }

    if(!checkInDate){
        return  res.status(401).json("Please Enter the CheckIn Date")
    }
    if(!checkOutDate){
        return  res.status(401).json("Please Enter the CheckOut Date ")
      }
    if(!nights){
        return  res.status(401).json("Please Enter the Nights Staying")
      }

    if(!billingUser){
        return res.status(401).json("Please Enter A Billing user")
    }


    try{

        
        const newReservation=new ReservationDetails({
            refNo,
            billingGuestName,
            guestEmail,
            guestContact,
            advancePayment,
            lastPayment,
            totalPrice,
            roomCharges,
            tax,
            paymentMode,
            bookingInfo,
            agent,
            bookingType,
            checkInDate,
            checkOutDate,
            nights,
            hotelName:hotelAdmin[0].hotelname,
            hotelEmail:hotelAdmin[0].email,
            taxInc,
            billingUser,
            hotelId,
            isCheckedIn:false
        })
        console.log(hotelAdmin[0].hotelname)
       
        let roomdetails=[]

        roomInformation.forEach(element => {
            roomdetails.push({
                roomId:element.roomId,
                adult:element.adult,
                child:element.child,
                ratePlan:element.ratePlan,
                roomPrice:element.roomPrice,
                roomType:element.roomType,
                guestName:element.guestName,
                roomNo:element.roomNo  
            })
        });

        newReservation.roomInfo=roomdetails

       console.log(roomdetails)


        const savedReservation=await newReservation.save();

        try{
            const guestFName=roomInformation[0].guestName

          
            let emailChar=guestEmail.split(',')
            const transporter=nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                service:"gmail",
                auth:{
                    user:"sumansamanta110@gmail.com",
                    pass:"ffgjdmchjlzopkrl"
                }
            })
            let mailHeading=""
            if(bookingType==="Enquiry"){
                mailHeading="On the Enquiry"
            }else if(bookingType==="Confirmed Booking"){
                mailHeading="Confirmed Booking"
            }

            const data=[
                {
                    refNo:refNo,
                    mailHeading:mailHeading,
                    hotelAdmin:JSON.parse(JSON.stringify(hotelAdmin)),
                    guestName:guestFName,
                    guestContact:guestContact,
                    guestEmail:guestEmail,
                    roomdetails:JSON.parse(JSON.stringify(roomdetails)),
                    checkInDate:checkInDate,
                    checkOutDate:checkOutDate,
                    nights:nights,
                    totalPrice:totalPrice,
                    advancePayment:advancePayment,
                    lastPayment:lastPayment,
                    bookingInfo:bookingInfo,
                    agent:agent,
                    bookingType:bookingType,
                    roomCharges:roomCharges,
                    tax:tax
                }
            ]

        

            ejs.renderFile(__dirname+'/emailtemplate.ejs', { data }, (err, html) => {
              if (err) throw err;


            const mailoptions={
                from:hotelAdmin.email,
                to:guestEmail,
                subject:`${mailHeading}`,
                html:html
            }

            transporter.sendMail(mailoptions,function(error,info){
                if(error){
                    console.log(error);
                }else{
                    console.log("Email Sent : "+info.response)
                }
            })
            })
        }catch(err){
            res.status(404).json(err);
        }

        res.status(200).json(savedReservation);
       
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.CreateNewGuest=async(req,res)=>{
    const {hotelId,guestName,guestEmail,guestContact}=req.body;

    if(!guestName){
        return res.status(401).json("Enter the Guest Name")
    }

    if(!guestEmail){
        return res.status(401).json("Enter Guest Email Id")
    }

    if(!guestContact){
        return res.status(401).json("Please Enter Guest Contact NO.")
    }

    const existingGuest=await GuestDetails.findOne({hotelId:hotelId,guestContact:guestContact})
    if(existingGuest){
        return res.status(401).json("This Guest is already registered. Tap on return guest to find it")
    }

    try{
        const newGuest=new GuestDetails({
            hotelId,
            guestName,
            guestContact,
            guestEmail
        })

        const savedGuest=await newGuest.save();
        res.status(200).json(savedGuest);
    }catch(err){
        res.status(500).json(err);
    }
}


exports.createNewServiceProvider=async(req,res)=>{
    const{OTA,TravelAgent,BookingEngine}=req.body;

    try{
        const newServiceProvider=new ServiceProvider({
            OTA,
            TravelAgent,
            BookingEngine
        })

        const savedServiceProvider=await newServiceProvider.save();
        res.status(200).json(savedServiceProvider)
    }catch(err){
        res.status(401).json(err)
        console.log(err)
    }
}


exports.createNewRoomDetails=async(req,res)=>{
    const{roomType,ratePlan,roomNo,rateCharges}=req.body;

    try{
        const newRoomDetails=new RoomDetails({
            roomType,
            ratePlan,
            roomNo,
            rateCharges
        })

        const savedRoomDetails= await newRoomDetails.save();
        res.status(200).json(savedRoomDetails);
     
    }catch(err){
        res.status(401).json(err)
    }
}

exports.findGuestDetails=async(req,res)=>{
    const{previousGuestName}=req.body
    try{
        const result=await ReservationDetails.find({guestName:previousGuestName});
        res.status(200).json(result)

    }catch(err){
        res.status(401).json("There is No previous guest by this name")
    }
}


// exports.getreservationsByName=async(req,res)=>{
//     const{previousGuestName}=req.body;

//     if(!previousGuestName){
//         res.status(500).json("Please Enter The Guest Name")
//     }

//     try{
//        const result= await ReservationDetails.find({guestName:previousGuestName});

//        res.status(200).json(result);
//     }catch(err){
        
//         res.status(401).json(err);
//     }
// }


exports.getRoomDetailsByroomType=async(req,res)=>{
   
    let operationDate=req.body.checkInDate
    try{

        // const roomStatus=await HouseKeepingMaster.findOne({hotelId:req.body.hotelId,})


        const result=await RoomSetting.find({roomType:req.body.roomType,hotelId:req.body.hotelId});
        
        const finalres=[];
        let RoomAvalaible=true;
        var k=0;
        for(var i=0;i<result.length;i++){
            RoomAvalaible=true
            for(var j=0;j<result[i].roomAvalability.length;j++){
                // console.log(result[i].roomAvalability[j].operationStartDate)
                // if(isDateBetween(result[i].roomAvalability[j].operationStartDate,
                //     result[i].roomAvalability[j].operationCompleteDate,operationDate)){
                //     RoomAvalaible=false;
                // }

                if(operationDate===result[i].roomAvalability[j].operationStartDate){
                    RoomAvalaible=false;
                }
            }
            if(RoomAvalaible===true){
                finalres[k++]=result[i]
            }
        }


        res.status(200).json(finalres);
    }
    catch(err){
        res.status(401).json(err);
    }
}

exports.getRoomDetailsByroomTypeForCheckIn=async(req,res)=>{
   
    let operationDate=req.body.checkInDate
    try{

        // const roomStatus=await HouseKeepingMaster.findOne({hotelId:req.body.hotelId,})


        const result=await RoomSetting.find({roomType:req.body.roomType,hotelId:req.body.hotelId});
        
        const finalres=[];
        const resultArr=[];
        let RoomAvalaible=true;
        var k=0;
        var z=0;
        for(var i=0;i<result.length;i++){
            RoomAvalaible=true
            for(var j=0;j<result[i].roomAvalability.length;j++){
                // console.log(result[i].roomAvalability[j].operationStartDate)
                // if(isDateBetween(result[i].roomAvalability[j].operationStartDate,
                //     result[i].roomAvalability[j].operationCompleteDate,operationDate)){
                //     RoomAvalaible=false;
                // }

                if(operationDate===result[i].roomAvalability[j].operationStartDate){
                    RoomAvalaible=false;
                }
            }
            if(RoomAvalaible===true){
                finalres[k++]=result[i]
            }
        }

        for(var i=0;i<finalres.length;i++){
            const houseKeepingres=await HouseKeepingMaster.find({roomNo:finalres[i].roomNo})
            if(houseKeepingres.roomStatus==="cleaned"){
                resultArr[z++]=finalres[i];
            }
        }


        res.status(200).json(resultArr);
    }
    catch(err){
        res.status(401).json(err);
    }
}


exports.getRoomsForCheckIn=async(req,res)=>{
    let operationDate=req.body.checkInDate;
    const roomType=req.body.roomType;
    const hotelId=req.body.hotelId;
    try{

        // const roomStatus=await HouseKeepingMaster.findOne({hotelId:req.body.hotelId,})


        const result=await RoomSetting.find({roomType:roomType,hotelId:hotelId});
        
        const finalres=[];
        let RoomAvalaible=true;
        var k=0;
        for(var i=0;i<result.length;i++){
            RoomAvalaible=true
            for(var j=0;j<result[i].roomAvalability.length;j++){
                // console.log(result[i].roomAvalability[j].operationStartDate)
                // if(isDateBetween(result[i].roomAvalability[j].operationStartDate,
                //     result[i].roomAvalability[j].operationCompleteDate,operationDate)){
                //     RoomAvalaible=false;
                // }

                if(operationDate===result[i].roomAvalability[j].operationStartDate){
                    RoomAvalaible=false;
                }
            }
            if(RoomAvalaible===true){
                const houseKeeping=await HouseKeepingMaster.findOne({hotelId:hotelId,roomNo:result[i].roomNo})
                console.log(houseKeeping)

                if(houseKeeping.roomStatus==="cleaned"){
                    finalres[k++]=result[i];
                }
            }
        }
        res.status(200).json(finalres);
        console.log(finalres);
    }
    catch(err){
        res.status(401).json(err);
    }

}

exports.getRoomDetailsByroomPlan=async(req,res)=>{
    try{  
        const result=await RoomSetting.find({ratePlan:req.body.ratePlan,hotelId:req.body.hotelId});
        res.status(200).json(result);
    }
    catch(err){
        res.status(401).json(err);
    }
}

exports.getRoomDetailsByroomNo=async(req,res)=>{
    try{
       
        const result=await RoomSetting.find({hotelId:req.body.hotelId,roomNo:req.body.roomNo});
        console.log(result)
        res.status(200).json(result);
    }
    catch(err){
        res.status(401).json(err);
    }
}


// exports.getRoomDetails=async(req,res)=>{
//     try{
//         const result=await RoomDetails.find();
//         res.status(200).json(result);
//     }
//     catch(err){
//         res.status(401).json(err);
//     }
// }



exports.getServiceProviderDetails=async(req,res)=>{
    try{
        const result=await ServiceProvider.find();
        res.status(200).json(result);
    }
    catch(err){
        res.status(401).json(err);
    }
}

exports.getReservations=async(req,res)=>{
    const todayDate=new Date();

    //console.log(todayDate.toISOString())
    try{

        
        const result=await ReservationDetails.find({hotelId:req.params.hotelId,isCheckedIn:false,checkInDate:{$gte:todayDate.toISOString()}});
    
        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.updatereservationsByDeletingRoom=async(req,res)=>{
   
    try{
           const response= await ReservationDetails.findOne(
            {_id: req.params.resId,"roomInfo.roomId":Number(req.params.roomId)}   
            )
            let taxInc=response.taxInc;
            let totalPrice=response.totalPrice;
            let roomCharges=response.roomCharges;
            let tax=response.tax
            let roomPrice=0;
            for (var i=0;i<response.roomInfo.length;i++){
                if(response.roomInfo[i].roomId===Number(req.params.roomId)){
                    roomPrice=response.roomInfo[i].roomPrice
                }
            }

            let deductedTotalPrice;
            let deductedRateCharges;
            let deductedTax;

             if(taxInc===false){
                if(response.totalPrice>=7500){
                    deductedRateCharges=roomPrice;
                    deductedTax=roomPrice*118/100-deductedRateCharges;
                }else {
                    deductedRateCharges=roomPrice;
                    deductedTax=roomPrice*112/100-deductedRateCharges;
               }
                deductedTotalPrice=deductedRateCharges+deductedTax
             }else {
                if(response.totalPrice>=7500){
                    deductedRateCharges=roomPrice*100/118
                    deductedTax=roomPrice-deductedRateCharges              
                }else {
                    deductedRateCharges=roomPrice*100/112
                    deductedTax=roomPrice-deductedRateCharges
                }
                deductedTotalPrice=deductedRateCharges+deductedTax   
             }

             const UpdatedTotalPrice=Math.round(((totalPrice-deductedTotalPrice) + Number.EPSILON) * 100) / 100;
             const UpdatedRoomCharges=Math.round(((roomCharges-deductedRateCharges) + Number.EPSILON) * 100) / 100;
             const UpdatedTax=Math.round(((tax-deductedTax) + Number.EPSILON) * 100) / 100;

             
    
        const result=await ReservationDetails.findOneAndUpdate(
            {_id: req.params.resId},
            {
                $pull: {
                    roomInfo: { roomId: Number(req.params.roomId)}
            },
                $set:{
                    roomCharges:UpdatedRoomCharges,
                    totalPrice:UpdatedTotalPrice,
                    tax:UpdatedTax,
                    lastPayment:UpdatedTotalPrice-response.advancePayment
                }
            
            }
          )

        const fullreservation=await ReservationDetails.find()
        res.status(200).json(fullreservation);  
    }catch(err){
        res.status(500).json(err);
    }
}


exports.updatereservations=async(req,res)=>{
    try{

        const {guestContact,guestEmail,guestName}=req.body;
    
        const result=await ReservationDetails.findOneAndUpdate(
            {_id: req.params.resId,
            "roomInfo.roomId":Number(req.params.roomId)},{
                $set:{
                    "guestEmail":guestEmail,
                    "guestContact":guestContact,
                    "roomInfo.$.guestName":guestName
                }
            }  
          )

        const fullreservation=await ReservationDetails.find()
        res.status(200).json(fullreservation)    
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
}


exports.getAdvancePayment=async(req,res)=>{
    try{
        const result=await ReservationDetails.findById(req.params.resId)
        
        res.status(200).json(result)

    }catch(err){
        res.status(401).json(err)
    }
}

exports.addPayment=async(req,res)=>{
    const {advancePayment}=req.body
    try{
    const reqreservation=await ReservationDetails.findById(req.params.resId)
        
    const reservation=await ReservationDetails.findByIdAndUpdate({_id:req.params.resId},{
        $set:{
            advancePayment:advancePayment,
            lastPayment:(reqreservation.totalPrice-advancePayment)
        }
    },{new:true})

    const allReservations=await ReservationDetails.find();

    res.status(200).json(allReservations)
   

    }catch(err){
        res.status(401).json(err)
    }
}




exports.ReEmailGenerate=async(req,res)=>{
    try{
        const currentReservation=await ReservationDetails.findOne({_id:req.params.resId});
        const hotelAdmin=await HotelAdmin.findById({_id:req.params.hotelAdminId})

        try{
            const guestFName=currentReservation.roomInfo[0].guestName
            const refNo=currentReservation.refNo
            const guestContact=currentReservation.guestContact
            const guestEmail=currentReservation.guestEmail
            const roomdetailsUpdated=JSON.parse(JSON.stringify(currentReservation.roomInfo))
            const checkInDate=currentReservation.checkInDate
            const checkOutDate=currentReservation.checkOutDate
            const nights=currentReservation.nights
            const totalPrice=currentReservation.totalPrice
            const advancePayment=currentReservation.advancePayment
            const lastPayment=currentReservation.lastPayment
            const bookingInfo=currentReservation.bookingInfo
            const agent=currentReservation.agent
            const bookingType=currentReservation.bookingType
            const roomCharges=currentReservation.roomCharges
            const tax=currentReservation.tax

            // console.log( JSON.stringify(roomdetailsUpd  77ated))
          
            let emailChar=guestEmail.split(',')
            const transporter=nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                service:"gmail",
                auth:{
                    user:"sumansamanta110@gmail.com",
                    pass:"ffgjdmchjlzopkrl"
                }
            })
            let mailHeading=""
            if(bookingType==="Enquiry"){
                mailHeading="On the Enquiry"
            }else if(bookingType==="Confirmed Booking"){
                mailHeading="Confirmed Booking"
            }

            const data=[
                {
                    refNo:refNo,
                    mailHeading:mailHeading,
                    hotelAdmin:JSON.parse(JSON.stringify(hotelAdmin)),
                    guestName:guestFName,
                    guestContact:guestContact,
                    guestEmail:guestEmail,
                    roomdetails: roomdetailsUpdated,
                    checkInDate:checkInDate,
                    checkOutDate:checkOutDate,
                    nights:nights,
                    totalPrice:totalPrice,
                    advancePayment:advancePayment,
                    lastPayment:lastPayment,
                    bookingInfo:bookingInfo,
                    agent:agent,
                    bookingType:bookingType,
                    roomCharges:roomCharges,
                    tax:tax
                }
            ]

            console.log(data)

             ejs.renderFile(__dirname+'/reemailtemplate.ejs', { data }, (err, html) => {

               if(err) console.log(err)



            const mailoptions={
                from:hotelAdmin.email,
                to:guestEmail,
                subject:`${mailHeading}`,
                html:html
            }

            transporter.sendMail(mailoptions,function(error,info){
                if(error){
                    console.log(error)
                }else{
                    console.log("Email Sent : "+info.response)
                }
            })
            })

            res.status(200).json(data)
        }catch(err){
            res.status(404).json(err)
        }
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
}


exports.searchInReservationsByGuestName=async(req,res)=>{
    const {guestName}=req.body;
    const hotelId=req.params.hotelId;

    try{
        const result=await ReservationDetails.find({hotelId:hotelId,
            billingGuestName:{ $regex: new RegExp('^'+guestName+'.*','i') }}).exec();

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}



exports.searchInReservationsByContactNo=async(req,res)=>{
    const {guestContact}=req.body;
    const hotelId=req.params.hotelId;
    const todayDate=new Date();
    try{
        const result=await ReservationDetails.find({hotelId:hotelId,isCheckedIn:false,checkInDate:{$gte:todayDate.toISOString()},guestContact:{ $regex: new RegExp(guestContact,'i')
         }}).exec();

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
        console.log(err);
    }
}




exports.searchInReservationsByContact=async(req,res)=>{
    const {guestContact}=req.body;
    
    const hotelId=req.params.hotelId;

    console.log(guestContact);
    try{
        const result=await ReservationDetails.find({hotelId:hotelId,
            guestContact:guestContact,isCheckedIn:false
        })

        const result2=await ReservationDetails.find({
            hotelId:hotelId,
            billingGuestName:guestContact,
            isCheckedIn:false
        })

        if(result.length>0){
            
           res.status(200).json(result);
        }else{
            res.status(200).json(result2);
        }

    }catch(err){
        res.status(401).json(err);
        console.log(err);
    }
}

exports.getReservationsByRefNo=async(req,res)=>{
    const refNo=Number(req.params.refNo);

    try{
        const result=await ReservationDetails.findOne({refNo:refNo});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getAsingleRoomFromReservation=async(req,res)=>{
    const refNo=Number(req.params.refNo);
    const roomId=Number(req.params.roomId);

    try{

        const response=await ReservationDetails.findOne({
            refNo:refNo
        });
        const roomInfoArr=response.roomInfo;
        const desiredObj=roomInfoArr.find(obj => obj.roomId === roomId)

        res.status(200).json(desiredObj);
        console.log(desiredObj);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.changePerRoomPrice=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const resId=Number(req.params.resId);
    const roomNo=req.params.roomNo;
    const {availableId,updatedRoomNO,checkInDate,checkOutDate,name}=req.body;

    try{

        const UpdatedRoomAvailability={
            roomAvailableId:availableId,
            operationStartDate:checkInDate,
            operationCompleteDate:checkOutDate,
            roomAvailable:false,
            roomStatus:"Reserved",
            name:name
        }


        const room=await RoomSetting.updateOne({hotelId:hotelId,roomNo:Number(updatedRoomNO)},{

            $push:{roomAvalability:{$each:[UpdatedRoomAvailability]
           
            }}
            
        });
        
        const deleteRoom=await RoomSetting.updateOne({hotelId:hotelId,roomNo:Number(roomNo)},{
            $pull:{
                roomAvalability:{roomAvailableId:availableId}
            }
        })
        try{

        const reservation=await ReservationDetails.updateOne({hotelId:hotelId,refNo:resId,"roomInfo.roomNo":roomNo},{
            $set: { "roomInfo.$.roomNo": updatedRoomNO }
        },{new:true})


        
        const allReservations=await ReservationDetails.find({hotelId:hotelId});
        res.status(200).json(allReservations);
    
        }catch(err){
            console.log(err);
        }

    }catch(err){
        res.status(500).json(err);
        console.log(err);
    } 

}


function isDateBetween(startDate, endDate, dateToCheck) {
    const start = moment(startDate)
    const end = moment(endDate)
    const check = moment(dateToCheck)
    
   return (check.isBetween(start,end)||check.isSame(start))
  }


exports.reservationUpdateOnCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const refNo=req.params.refNo;
    console.log(hotelId+"hi")
    console.log(refNo);
    try{
        const result=await ReservationDetails.updateOne({hotelId:hotelId,refNo:refNo},{
            $set:{
                isCheckedIn:true
            }
        },{new:true})

        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
}




  exports.invoiceGenerate = async (req, res) => {
    const { guestContact } = req.body;
    const {refNo} =req.body
    const hotelId = req.params.hotelId;
  
    try {
      const Reservation = await ReservationDetails.findOne({
        hotelId,
        guestContact,
        refNo
      })
  
      if (!Reservation) {
        return res
          .status(404)
          .json({ success: false, message: "Reservation not found" });
      }
  
      const today = moment().format("DD-MM-YYYY");
  
      
      try {
        
        const refNo = Reservation.refNo;
        const guestContact = Reservation.guestContact;
        const guestEmail = Reservation.guestEmail;
        const roomdetails= JSON.parse(
          JSON.stringify(Reservation.roomInfo)
        );
        const checkInDate = Reservation.checkInDate;
        const checkOutDate = Reservation.checkOutDate;
        const nights = Reservation.nights;
        const totalPrice = Reservation.totalPrice;
        const advancePayment = Reservation.advancePayment;
        const lastPayment = Reservation.lastPayment;
        const bookingInfo = Reservation.bookingInfo;
        const agent = Reservation.agent;
        const bookingType = Reservation.bookingType;
        const roomCharges = Reservation.roomCharges;
        const tax = Reservation.tax;
      
      
  
      const invoiceData=[{
              
        refNo:refNo,
        guestContact:guestContact,
        guestEmail:guestEmail,
        roomdetails :roomdetails,
        totalPrice:totalPrice,
        advancePayment:advancePayment,
        lastPayment:lastPayment,
        checkInDate:checkInDate,
        checkOutDate:checkOutDate,
        nights:nights,
        bookingInfo:bookingInfo,
        agent:agent,
        bookingType:bookingType,
        roomCharges:roomCharges,
        tax:tax,
        today:today
      }]
  
      
  
      const reservationInvoice = {
        displayData: invoiceData,
      };
  
      const invoiceTemplatePath = path.resolve(
        __dirname,
        "../controller/invoice.ejs"
      );
  
      const desktopFilePath = path.resolve(
        process.env.USERPROFILE,
        "Desktop",
        Date.now()+"invoice.pdf"
      );
  
      
  
      const htmlString = fs.readFileSync(invoiceTemplatePath).toString();
      const ejsData = ejs.render(htmlString, reservationInvoice);
  
      const pdfOptions = {
        format: "letter",
      };
  
      pdf.create(ejsData, pdfOptions).toFile(desktopFilePath, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
  
        console.log("Invoice generated successfully");
        res.status(200).json({ success: true, data: invoiceData });
      });
    }catch(err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

exports.getFailedReservations=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const todayDate=new Date();
    try{
        const result=await ReservationDetails.find({hotelId:hotelId,checkInDate:{$lt:todayDate.toISOString()}});

        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
        console.log(err);
    }
}