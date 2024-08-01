const express=require("express");
const router=express.Router();

const {createHousekeepingMaster,updateHouseKeepingMaster,getHouseKeepingMaster,createATask,updateATask,
    getAllTask,deleteATask,roomstatuspdf,getHouseKeepingMasterByRoomNo,getAvailableRoomsForCheckIn,
    updateHouseKeepingMasterOnCheckout,deleteHouseKeepingMasterRoom,getAllAvailableRoomsforRoomShifting} =require("../../controller/HouseKeepingManageController/houseKeepingManage");


router.post("/hoteladmin/create/houseKeepingMaster/:hotelId",createHousekeepingMaster);
router.put("/hoteladmin/update/houseKeepingMaster/:hotelId/:roomNo",updateHouseKeepingMaster);
router.get("/hoteladmin/getAllHouseKeepingMasters/:hotelId",getHouseKeepingMaster);
router.post("/hoteladmin/getHouseKeepingByRoomNo/:hotelId/:roomNo",getHouseKeepingMasterByRoomNo);
router.delete("/hoteladmin/deleteHousekeepingMaster/:hotelId/:roomNo",deleteHouseKeepingMasterRoom);

router.put("/hoteladmin/updateRoomsonCheckOut/:hotelId/:roomNo",updateHouseKeepingMasterOnCheckout)

router.post("/hoteladmin/getAvailableRoomsForCheckIn/:hotelId",getAvailableRoomsForCheckIn);
router.get("/hoteladmin/getAllAvaiableRooms/:hotelId",getAllAvailableRoomsforRoomShifting);

router.post("/hoteladmin/create/NewTask/:hotelId",createATask);
router.put("/hoteladmin/update/task/:taskId",updateATask);
router.get("/hoteladmin/getAllTasks/:hotelId",getAllTask);
router.delete("/hoteladmin/deleteTask/:taskId",deleteATask);
router.post("/hoteladmin/roomStatusPdf/:hotelId",roomstatuspdf);

module.exports=router;