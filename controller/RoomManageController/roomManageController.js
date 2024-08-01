const RoomSetting = require("../../models/reservation/RoomSetting");
const RoomTypeDetails = require("../../models/reservation/RoomTypeDetails");
const moment=require('moment')


exports.createNewRoomType=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {roomType}=req.body;
    try{
        const newRoomType=new RoomTypeDetails({
            hotelId,
            roomType
        })

        const SavedRoomType=await newRoomType.save();
        res.status(200).json(SavedRoomType);

    }catch(err){
        res.status(401).json(err)
    }
}


exports.getAllRoomType=async(req,res)=>{

    const hotelId=req.params.hotelId;

    try{
        const result=await RoomTypeDetails.find({hotelId:hotelId});
        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.UpdateRoomType=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomTypeId=req.params.roomTypeId;
    const {roomType}=req.body;
    console.log(roomType);
    try{
        const result=await RoomTypeDetails.findByIdAndUpdate(roomTypeId,{
            $set:{
                roomType:roomType
            }
        },{new:true});

        const allRoomType=await RoomTypeDetails.find({hotelId:hotelId});
        if(result){
         res.status(200).json(allRoomType);
        }else{
            res.status(401).json("Room Type Not Updated")
        }
    }catch(err){
        res.status(401).json(err)
    }
}

exports.deleteRoomType=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomType=req.params.roomType;
    try{
        const result=await RoomTypeDetails.deleteOne({hotelId:hotelId,roomType:roomType});
        const allRoomType=await RoomTypeDetails.find({hotelId:hotelId});
         res.status(200).json(allRoomType);
    }catch(err){
        res.status(401).json(err)
    }
}

exports.getARoomTypeOfAParticularRoom=async(req,res)=>{
    const roomNo=Number(req.params.roomNo);
    const hotelId=req.params.hotelId;
    try{
       const room=await RoomSetting.findOne({hotelId:hotelId,roomNo:roomNo});
       res.status(200).json(room);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.createNewRoom=async(req,res)=>{
    const {roomType,roomNo,rateCharges,roomFloor,roomName,createdBy,hotelId}=req.body;

    const result=await RoomSetting.findOne({roomNo:roomNo})

    if(result){
        return res.status(401).json("This Room No is Already exists")
    }

    try{
        const newRoom=new RoomSetting({
            roomType,
            roomNo,
            rateCharges,
            roomFloor,
            roomName,
            createdBy,
            hotelId
        })

        console.log(newRoom)
        const SavedRoom=await newRoom.save();
        res.status(200).json(SavedRoom)
        console.log(SavedRoom)
    }catch(err){
        res.status(401).json(err)
    }
}


exports.deleteARoom=async(req,res)=>{
    const roomTobeDeleted=req.params.roomNO;
    const hotelId=req.params.hotelId;

    try{
        const result=await RoomSetting.deleteOne({hotelId:hotelId,roomNo:roomTobeDeleted})

        const updatedRooms=await RoomSetting.find({hotelId:hotelId});
        res.status(200).json(updatedRooms);
    }catch(err){
        res.status(400).json(err)
    }
}

exports.UpdateARoom=async(req,res)=>{

    const roomId=Number(req.params.roomNo);
    const hotelId=req.params.hotelId;

    const {roomType,roomNo,rateCharges,roomFloor,roomName,createdBy}=req.body;

    try{
        const UpdatedRoom=await RoomSetting.updateOne({hotelId:hotelId,roomNo:roomId},{
            $set:{
                roomType,
                roomNo,
                roomFloor,
                roomName,
                rateCharges,
                createdBy
            }
        },{new:true})


        const updatedRooms=await RoomSetting.find({hotelId:hotelId});
        res.status(200).json(updatedRooms);


    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}

exports.updateARoomPrice=async(req,res)=>{
     const roomNo=Number(req.params.roomNo);
     const hotelId=req.params.hotelId;
     const {rateCharges}=req.body;

     if(!rateCharges){
        return res.status(401).json("Please Enter the Room Price");
     }
     try{
        const Room=await RoomSetting.updateOne({hotelId:hotelId,roomNo:roomNo},{
            $set:{
                rateCharges:rateCharges
            }
         },{new:true});

         
    
         const updatedRooms=await RoomSetting.find({hotelId:hotelId});
         res.status(200).json(updatedRooms);

     }catch(err){
        res.status(500).json(err);
        console.log(err);
     }
}


exports.ReservationRoomUpdate=async(req,res)=>{

    const {availableId,checkInDate,checkOutDate,guestName}=req.body;
    let roomNo=Number(req.params.roomNo);
    let hotelId=req.params.hotelId;

    console.log(req.body);
    console.log(hotelId);
    console.log(roomNo);

    const room=await RoomSetting.findOne({roomNo:roomNo,hotelId:hotelId});

    for(var i=0;i<room.roomAvalability.length;i++){

        if(isDateBetween(room.roomAvalability[i].operationStartDate,room.roomAvalability[i].operationCompleteDate,checkInDate)){
            return res.status(401).json("This Room is not Available in this date")
        }
    }
    try{


    let newelm={ 
        roomAvailableId:availableId,
        operationStartDate:checkInDate,
        operationCompleteDate:checkOutDate,
        roomStatus:"Reserved",
        roomAvailable:false,
        name:guestName
    }

    const room=await RoomSetting.updateOne({hotelId:hotelId,roomNo:roomNo},{


        $push:{roomAvalability:{$each:[newelm]
           
        }}
    })

    res.status(200).json(room)

    }catch(err){
        res.status(401).json(err)
    }
}


exports.CheckInRoomUpdate=async()=>{
    const {availableId,checkInDate,checkOutDate,guestName}=req.body;
    let roomNo=Number(req.params.roomNo)
    let hotelId=req.params.hotelId

    const room=await RoomSetting.findOne({roomNo:roomNo,hotelId:hotelId})


    for(var i=0;i<room.roomAvalability.length;i++){
        if(isDateBetween(room.roomAvalability[i].operationStartDate,room.roomAvalability[i].operationCompleteDate,checkInDate)){
            if(room.roomAvalability[i].roomStatus==false){
                return res.status(401).json("This Room is not Available in this date")
            }
       
        }
    }
    try{
    let newelm={ 
        roomAvailableId:availableId,
        operationStartDate:checkInDate,
        operationCompleteDate:checkOutDate,
        roomStatus:"CheckedIn",
        roomAvailable:false,
        name:guestName
    }

    const room=await RoomSetting.updateOne({hotelId:hotelId,roomNo:roomNo},{
        $push:{roomAvalability:{$each:[newelm]    
        }}
    })

    res.status(200).json(room);

    }catch(err){
        res.status(401).json(err);
    }

}


exports.getAllRooms=async(req,res)=>{
    const hotelId=req.params.hotelId;
    try{
        const result=await RoomSetting.find({hotelId:hotelId});
        res.status(200).json(result);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.getAllAvailableRooms=async(req,res)=>{

    const dateToCheck=req.params.date;
    let availableRooms=[]
    let unavailableRooms=[]
    let k=0;
    let c=0
    let hotelId=req.params.hotelId;
    let reservationAvailable=true;
    try{
        const roomres=await RoomSetting.find({hotelId:hotelId});

        for(var i=0;i<roomres.length;i++){
            reservationAvailable=true;
            if(roomres[i].roomAvalability.length>0){
            for(var j=0;j<roomres[i].roomAvalability.length;j++){
                if(isDateBetween(roomres[i].roomAvalability[j].operationStartDate,
                    roomres[i].roomAvalability[j].operationCompleteDate,dateToCheck)){
                        if(roomres[i].roomAvalability[j].roomAvailable===false){
                            unavailableRooms[c++]=roomres[i];
                            reservationAvailable=false;
                        }
                }
            }
            if(reservationAvailable==true){
                availableRooms[k++]=roomres[i];
            }
        }else{
            availableRooms[k++]=roomres[i];
        }
    }
      res.status(200).json({availableRooms,
                            unavailableRooms});
    }catch(err){
        res.status(401).json(err);
    }
    
}


function isDateBetween(startDate, endDate, dateToCheck) {
    const start = moment(startDate);
    const end = moment(endDate);
    const check = moment(dateToCheck);

   return (check.isBetween(start,end)||check.isSame(start)) 
  }

