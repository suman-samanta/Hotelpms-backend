const express=require("express");
const app=express();
const dotenv= require("dotenv");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const fileUpload=require("express-fileupload");


const superAdminRoute=require('./routes/superadmin/auth');
const hotelAdminRoute=require('./routes/hoteladmin/auth');
const reservationRoute=require('./routes/reservation/reservation');
const roomManageRoute=require('./routes/roommanage/RoomManage');
const houseKeepingManageRoute=require('./routes/housekeepingmanage/HouseKeepingManage');
const CheckInManageRoute=require("./routes/checkInAndCheckOutManage/CheckInAndCheckOutManage");
const nightClosureRoute=require("./routes/nightClosure/nightclosure");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

dotenv.config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(fileUpload());


mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
.then(()=>console.log("connection successful...Mongodb Database connected successfully"))
.catch((err)=>console.log(err));


app.use("/server/auth",superAdminRoute);
app.use("/server/auth",hotelAdminRoute);
app.use("/server",reservationRoute);
app.use("/server",roomManageRoute);
app.use("/server",houseKeepingManageRoute);
app.use("/server",CheckInManageRoute);
app.use("/server/hoteladmin",nightClosureRoute);

app.post("/upload",(req,res)=>{
    console.log(req.files.contract_path.name)
    const filename=Date.now()+"_"+req.files.contract_path.name;
    const file=req.files.contract_path;
    let uploadPath=__dirname+"/uploads/hotelContract/"+filename
    file.mv(uploadPath,(err)=>{
        if(err){
           return res.status(400).json(err);
        }
    })
    res.status(200).json("file uploaded")
})

module.exports=app;
