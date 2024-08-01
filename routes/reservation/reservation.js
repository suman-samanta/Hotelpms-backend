const express=require("express");
const router=express.Router();

const{createNewReservation,createNewServiceProvider,getServiceProviderDetails,getRoomDetailsByroomType
,getRoomDetailsByroomNo,getReservations,updatereservationsByDeletingRoom,invoiceGenerate,searchInReservationsByContact,
updatereservations,ReEmailGenerate,getAdvancePayment,addPayment,CreateNewGuest,getReservationsByRefNo,getAsingleRoomFromReservation,
searchInReservationsByGuestName,searchInReservationsByContactNo,changePerRoomPrice,getRoomDetailsByroomTypeForCheckIn
,reservationUpdateOnCheckIn,getFailedReservations}=require("../../controller/reservation")

const {searchPreviousGuest,searchPreviousGuestByContact}=require("../../controller/GuestManageController/guestManage")



// Reservation post requests
router.post("/hoteladmin/addreservation",createNewReservation);
router.post("/hoteladmin/addServiceprovider",createNewServiceProvider);
// router.post("/hoteladmin/addroomdetails",createNewRoomDetails);
router.post("/hoteladmin/createNewGuest",CreateNewGuest);
router.get("/hoteladmin/getPreviousGuest/:guestName/:hotelId",searchPreviousGuest);
router.get("/hoteladmin/getPreviousGuestByContact/:guestContact",searchPreviousGuestByContact);


// Reservation get requests

router.post("/hoteladmin/getroomsdetailsByroomType",getRoomDetailsByroomType);
router.post("/hotelamin/getRoomDetailsByRoomTypeForCheckIn",getRoomDetailsByroomTypeForCheckIn)
router.post("/hoteladmin/getroomdetailsbyroomNo",getRoomDetailsByroomNo);
router.get("/hoteladmin/getServiceProvider",getServiceProviderDetails);
router.get("/hoteladmin/getReservationDetails/:hotelId",getReservations);
router.put("/hoteladmin/deleteRooms/:resId/:roomId",updatereservationsByDeletingRoom);
router.put("/hoteladmin/updateGuestInfo/:resId/:roomId",updatereservations);
router.post("/hoteladmin/ReEmailGenerate/:resId/:hotelAdminId",ReEmailGenerate);
router.get("/hoteladmin/getAdvancePayment/:resId",getAdvancePayment);
router.put("/hoteladmin/addpayment/:resId",addPayment);
router.post("/hoteladmin/getReservationsByGuestName/:hotelId",searchInReservationsByGuestName);
router.post("/hoteladmin/getReservationsByContactNo/:hotelId",searchInReservationsByContactNo);
router.post("/hoteladmin/getReservation/ByContactNo/:hotelId",searchInReservationsByContact);
router.get("/hoteladmin/getReservationByRefNo/:refNo",getReservationsByRefNo);
router.put("/hoteladmin/changePerRoomPriceInReservation/:hotelId/:resId/:roomNo",changePerRoomPrice);

router.put("/hoteladmin/reservationUpdateonCheckIn/:hotelId/:refNo",reservationUpdateOnCheckIn);
router.post("/hoteladmin/invoiceGenerate/:hotelId",invoiceGenerate);
router.get("/hoteladmin/getFailedReservations/:hotelId",getFailedReservations);


router.get("/hoteladmin/getaSingleRoomFromReservation/:refNo/:roomId",getAsingleRoomFromReservation)

module.exports=router;