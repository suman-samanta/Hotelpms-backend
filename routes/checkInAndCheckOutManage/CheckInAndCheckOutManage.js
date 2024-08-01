const express=require("express");

const router=express.Router();

const { CreateNewCheckIn,updateCheckIn,CheckInCancel,getCheckInBySearching,getCheckInBySearchingRoomNo,
    CheckOutARoom,searchInCheckOut,reCheckInRoom,getActiveCheckIn,getAllCheckOut,getCheckInOnSpecificDate,
    getAllreservationsToCheckIn,roomShiftingAfterCheckIn,getTotalBillAfterCheckOut,completeFullPayment,
    getActiveCheckInByMobileNo} = require("../../controller/CheckInAndCheckOutManageController/CheckInCheckOutManage");

router.post("/hoteladmin/CheckInAndCheckOutManage/:hotelId",CreateNewCheckIn);
router.put("/hoteladmin/checkInUpdate/:hotelId/:checkInId",updateCheckIn);
router.put("/hoteladmin/checkInCancel/:hotelId/:checkInId",CheckInCancel);

router.post("/hoteladmin/getCheckInBySearching/:hotelId",getCheckInBySearching);
router.post("/hoteladmin/getCheckInBySearchingRoomNo/:hotelId",getCheckInBySearchingRoomNo);
router.put("/hoteladmin/CheckOutARoom/:checkInId",CheckOutARoom);
router.post("/hoteladmin/searchInCheckOut/:hotelId",searchInCheckOut);

router.post("/hoteladmin/getCheckInOnspecificDate/:hotelId",getCheckInOnSpecificDate);
router.get("/hoteladmin/getCheckRemain/:hotelId",getAllreservationsToCheckIn);
router.get("/hoteladmin/getActiveCheckIn/:hotelId",getActiveCheckIn);
router.get("/hoteladmin/getAllCheckOut/:hotelId",getAllCheckOut);

router.put("/hoteladmin/recheckIn/:checkInId",reCheckInRoom);
router.put("/hoteladmin/roomShiftingafterCheckIn/:hotelId/:Id",roomShiftingAfterCheckIn);
router.get("/hoteladmin/getTotalBillAfterCheckOut/:hotelId/:refNo",getTotalBillAfterCheckOut);

router.put("/hoteladmin/updateCompletePaymentStatus/:hotelId/:refNo",completeFullPayment);
router.post("/hoteladmin/GetActiveCheckInByMobileNo/:hotelId",getActiveCheckInByMobileNo);

module.exports=router;