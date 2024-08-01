const express=require("express");
const router=express.Router();

const {createNewRoomType,createNewRoom,getAllRoomType,ReservationRoomUpdate,
    getAllAvailableRooms,getAllRooms,deleteARoom,UpdateARoom,updateARoomPrice,
    deleteRoomType,CheckInRoomUpdate,getARoomTypeOfAParticularRoom,UpdateRoomType}=require("../../controller/RoomManageController/roomManageController")

router.post("/hoteladmin/addNewRoomType/:hotelId",createNewRoomType);
router.post("/hoteladmin/addNewRoom",createNewRoom);
router.get("/hoteladmin/getRoomType/:hotelId",getAllRoomType);
router.put("/hoteladmin/updateRoomType/:hotelId/:roomTypeId",UpdateRoomType);
router.delete("/hoteladmin/deleteRoomType/:hotelId/:roomType",deleteRoomType);
router.put("/hoteladmin/updateRoomsOnReservation/:roomNo/:hotelId",ReservationRoomUpdate);
router.put("/hoteladmin/updateRoomsOnCheckIn/:roomNo/:hotelId",CheckInRoomUpdate);

router.get("/hoteladmin/getAParticularRoomType/:hotelId/:roomNo",getARoomTypeOfAParticularRoom);

router.get("/hoteladmin/getAllRooms/:hotelId",getAllRooms);
router.delete("/hoteladmin/deleteRoom/:roomNO/:hotelId",deleteARoom);
router.put("/hoteladmin/updateARoom/:roomNo/:hotelId",UpdateARoom); 
router.put("/hoteladmin/updateARoomPrice/:roomNo/:hotelId",updateARoomPrice); 


router.get("/hoteladmin/view/available/:date/:hotelId",getAllAvailableRooms);

module.exports=router;