const express=require("express");
const router=express.Router();
const multer=require("multer");

const {createNewHotelAdmin,loginHotelAdmin,getallhotels,addsubscription,getsubscriptions,
    gethoteldetailsById,updateHotelDetailsById} =require('../../controller/hoteladmin');



//   Hotel account create and login route
router.post("/hoteladmin/register",createNewHotelAdmin);
router.post("/hoteladmin/login",loginHotelAdmin);
router.get("/hoteladmin/getallhotels",getallhotels);
router.get("/hoteladmin/gethotels/:hotelId",gethoteldetailsById)
router.put("/hoteladmin/updatehotel/:hotelId",updateHotelDetailsById)

// subscription page routes     
router.post("/hoteladmin/addsubscription",addsubscription);
router.get("/hoteladmin/getsubscriptions",getsubscriptions);

module.exports=router;
