const express=require("express");
const router=express.Router();

const {getReservationThatNotCheckedIn}=require("../../controller/nightClosureController/nightClosureController");

router.get("/getReservationThatNotCheckedIn/:hotelId",getReservationThatNotCheckedIn);

module.exports=router;