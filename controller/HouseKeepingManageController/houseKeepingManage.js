const HouseKeepingMaster = require("../../models/houseKeeping/HouseKeepingMaster");
const TaskManagement = require("../../models/houseKeeping/TaskManagement");
const RoomSetting = require("../../models/reservation/RoomSetting");
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const CheckInAndCheckoutTable = require("../../models/checkInAndCheckOutTable/CheckInAndCheckoutTable");

let JobIdCount=1;

exports.createHousekeepingMaster=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {roomNo,roomType,roomStatus,cleaningDate,assigned,report,createdBy}=req.body;

    console.log(hotelId,
        roomNo,
        roomType,
        roomStatus,
        cleaningDate,
        assigned,
        report,
        createdBy)

    if(!roomNo){
        return res.status(401).json("Enter The Room No");
    }
    if(!roomType){
        return res.status(401).json("Enter the Room Type")
    }
    if(!roomStatus){
        return res.status(401).json("Enter The Room Status");
    }
    if(!cleaningDate){
        return res.status(401).json("Enter The Cleaning Date");
    }
    if(!assigned){
        return res.status(401).json("Enter The assigned person name");
    }

    try{

       
        const newHouseKeepingMaster=new HouseKeepingMaster({
            hotelId,
            roomNo,
            roomType,
            roomStatus,
            cleaningDate,
            assigned,
            report,
            createdBy,
            updatedBy:createdBy
        })

        console.log(newHouseKeepingMaster);

        const houseKeepingMaster=await newHouseKeepingMaster.save();

        res.status(200).json(houseKeepingMaster);

    }catch(err){
        res.status(401).json(err)
    }
}

exports.updateHouseKeepingMaster=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomNo=Number(req.params.roomNo);
    const {roomStatus,assigned,report,updatedBy}=req.body;

    try{
        const newUpdatedHouseKeeping=await HouseKeepingMaster.updateOne({hotelId:hotelId,roomNo:roomNo},{
            $set:{
                roomStatus,

                assigned,
                report,
                updatedBy
            }
        },{new:true});

        const updatedHouseeKeepingRoom=await HouseKeepingMaster.find({hotelId:hotelId,roomNo:roomNo});

        res.status(200).json(updatedHouseeKeepingRoom);
    }catch(err){
        res.status(401).json(err);
    }
    
}


exports.updateHouseKeepingMasterOnCheckout=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomNo=Number(req.params.roomNo);
    const {updatedBy}=req.body;

    try{
        const newUpdatedHouseKeeping=await HouseKeepingMaster.updateOne({hotelId:hotelId,roomNo:roomNo},{
            $set:{
                roomStatus:"review",
                report:"Room Needs to check if cleaning required",
                updatedBy:updatedBy
            }
        });

        const updatedHouseeKeepingRoom=await HouseKeepingMaster.find({hotelId:hotelId,roomNo:roomNo});

        res.status(200).json(updatedHouseeKeepingRoom);
    }catch(err){
        res.status(401).json(err);
    }
    
}





exports.getHouseKeepingMasterByRoomNo=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomNo=Number(req.params.roomNo);
    const result=await HouseKeepingMaster.findOne({hotelId:hotelId,roomNo:roomNo})

    if(result){
        if(result.roomStatus==="cleaned"){
           return res.status(200).json(true);
        }else{
          return res.status(200).json(false);
        }
    }else{
       return res.status(401).json(false);
    }
}


exports.getAvailableRoomsForCheckIn=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const {roomType}=req.body;
    let availableRooms=[];
    let j=0

    try{
        const result=await HouseKeepingMaster.find({hotelId:hotelId,roomType:roomType,roomStatus:"cleaned"});
        for(var i=0;i<result.length;i++){
           const checkInres=await CheckInAndCheckoutTable.findOne({hotelId:hotelId,roomNo:result[i].roomNo})
           if(!checkInres){
            availableRooms[j++]=result[i];
           }else if(checkInres.checkInStatus!=="true"){
            availableRooms[j++]=result[i];
           }
        }

        res.status(200).json(availableRooms);
    }catch(err){
        res.status(401).json(err);
    }
}

exports.getAllAvailableRoomsforRoomShifting=async(req,res)=>{
    const hotelId=req.params.hotelId;
    try{
        const result=await HouseKeepingMaster.find({hotelId:hotelId,roomStatus:"cleaned"});
        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
}

exports.getHouseKeepingMaster=async(req,res)=>{
    const hotelId=req.params.hotelId;

    try{
        const allHouseKeepingMaster=await HouseKeepingMaster.find({hotelId:hotelId});

        res.status(200).json(allHouseKeepingMaster);
    }catch(err){
        res.status(401).json(err);
    }
};

exports.deleteHouseKeepingMasterRoom=async(req,res)=>{
    const hotelId=req.params.hotelId;
    const roomNo=Number(req.params.roomNo);

    try{

        const deletedHousekeeping=await HouseKeepingMaster.findOneAndDelete({hotelId:hotelId,roomNo:roomNo});
        const allHouseKeepingMaster=await HouseKeepingMaster.find({hotelId:hotelId});

        res.status(200).json(allHouseKeepingMaster);
    }catch(err){
        res.status(401).json(err);
    }

}

exports.createATask=async(req,res)=>{
    const hotelId=req.params.hotelId;

    const {roomNo,task,date,assigned,taskStatus,remarks,cost,createdBy}=req.body;

    if(!roomNo){
        return res.status(401).json("Please Enter the Room No");
    }

    if(!task){
        return res.status(401).json("Please Enter the Task");
    }
    if(!date){
        return res.status(401).json("Please Enter the Date");
    }
    if(!assigned){
        return res.status(401).json("Please Enter the Assigned people Name");
    }
    if(!createdBy){
        return res.status(401).json("Please Enter who created this task!!");
    }
    

    try{
        const newTask= new TaskManagement({
            hotelId,
            jobId:JobIdCount,
            roomNo,
            task,
            date,
            assigned,
            remarks,
            taskStatus,
            cost,
            createdBy,
            updatedBy:createdBy
        });

        JobIdCount++;

        const savedNewTask=await newTask.save();

        res.status(200).json(savedNewTask);
        
    }catch(err){
        console.log(err);
        res.status(401).json(err);
    }
};


exports.updateATask=async(req,res)=>{
    const {task,date,assigned,remarks,cost,updatedBy}=req.body;

    try{
        const updatedTask=await TaskManagement.findByIdAndUpdate(req.params.taskId,{
            $set:{
                task,
                date,
                assigned,
                remarks,
                cost,
                updatedBy
            }
        });
    
        const NewUpdatedTask=await TaskManagement.findById(req.params.taskId);
        res.status(200).json(NewUpdatedTask);
    }catch(err){
        res.status(401).json(err);
    }
}


exports.getAllTask=async(req,res)=>{
    const hotelId=req.params.hotelId;

    try{
        const getAllTask=await TaskManagement.find({hotelId:hotelId});
        res.status(200).json(getAllTask);

    }catch(err){
        res.status(401).json(err);
    }
}

exports.deleteATask=async(req,res)=>{

    const taskId=req.params.taskId;

    try{
        const deletedTask=await TaskManagement.findByIdAndDelete(taskId);
        

        res.status(200).json("Task has Been deleted");
    }catch(err){
        res.status(401).json(err);
    }
}


exports.roomstatuspdf = async (req, res) => {
    try {
      console.log(req.params.hotelId);
      const data = await HouseKeepingMaster.find({
        hotelId: req.params.hotelId,
      });
  
      const datas = data.map((result) => ({
        roomNo: result.roomNo,
        roomStatus: result.roomStatus,
        cleaningDate: result.cleaningDate,
        assigned: result.assigned,
        report: result.report,
      }));
  
      
  
      roomstatusPdf = {
        displayData: datas,
      };
  
   
  
      const name = path.resolve(
        __dirname,
        "../../controller/HouseKeepingManageController/roomstatusPdf.ejs"
      );
      const currentDate = new Date().toISOString().replace(/[:.-]/g, "-");
      const Desktop = path.resolve(
        process.env.USERPROFILE,
        "Desktop",
        `${currentDate}.pdf`
      );
      const htmlString = fs.readFileSync(name).toString();
      let option = {
        format: "latter",
      };
      const ejsData = ejs.render(htmlString, roomstatusPdf);
      const result=await pdf.create(ejsData, option).toFile(Desktop, (err, response) => {
        if (err) console.log(err);
  
        console.log("PDF generated");
        res.status(200).json({ success: true, data: datas });
      });

      
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
