const HotelAdmin=require("../models/HotelAdmin");
const SubscriptionForm=require("../models/SubscriptionForm")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const path=require('path')

exports.createNewHotelAdmin=async(req,res)=>{

    try{
    const {ownername,hotelname,address,gst,email,contact,password,subscriptionDate,expiryDate,selectedPlan}=req.body;

    if(!ownername){
        return res.status(400).json("Owner Name is required");
    }

    if(!hotelname){
        return res.status(400).json("Hotel Name is required");
    }

    if(!address){
        return res.status(400).json("Hotel address is required");
    }

    if(!gst){
        return res.status(400).json("Please Enter the gst no.");
    }

    if(!email){
        return res.status(400).json("Email id is required");
    }
    if(!contact){
        return res.status(400).json("Contact No. is required");
    }
    if(!password){
        return res.status(400).json("password is required");
    }

    if(!req.files.contract_path){
        return res.status(400).json("contract file is required");
    }

    if(!subscriptionDate){
        return res.status(400).json("Subscription Date is required");
    }

    if(!expiryDate){
        return res.status(400).json("Expiry Date is required");
    }

    if(!selectedPlan){
        return res.status(400).json("Please Select atleast 1 plan");
    }


    const hoteladmin=await HotelAdmin.findOne({email:email});
    if(hoteladmin){
        return res.status(400).json("Email id is already in use");
    }

    const matchgst=await HotelAdmin.findOne({gst:gst});
    if(matchgst){
        return res.status(400).json("This gst Number is already in use");
    }

    if(gst.length<15){
        return res.status(400).json("Please Enter a valid Gst Number");
    }

    try{
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const role="hoteladmin"
        const filename=Date.now()+"_"+req.files.contract_path.name;
        
        const file=req.files.contract_path;
        let uploadPath=__dirname+"/upload/"+filename
        file.mv(uploadPath)
        const newHotelAdmin=new HotelAdmin({
            ownername,
            hotelname,
            address,
            gst,
            email,
            contact,
            password:passwordHash,
            contract_path:uploadPath,
            subscriptionDate,
            expiryDate,
            selectedPlan,
            role
        })
        const savedHotelAdmin = await newHotelAdmin.save();
        const token =generateToken(savedHotelAdmin._id)
         

        res.status(200).json({
            _id:savedHotelAdmin.id,
            ownername:ownername,
            hotelname:hotelname,
            address:address,
            gst:gst,
            email:email,
            contact:contact,
            contract_path:uploadPath,
            subscriptionDate:subscriptionDate,
            expiryDate:expiryDate,
            role:role,
            selectedPlan:selectedPlan,
            token:token
        })

    }catch(err){
        res.status(400).json(err);
    }

   }catch(err){
    res.status(500).json(err);
   }
};




exports.loginHotelAdmin=async(req,res)=>{
    try{
        const hoteladmin= await HotelAdmin.findOne({email:req.body.email});
        
        if(!hoteladmin){
            return res.status(401).json("This Email id is not registered !")
            }
        else{
            const validated=await bcrypt.compare(req.body.password,hoteladmin.password);

            if(!validated ){
                return res.status(400).json("Please enter correct password!")
                }else{
                    // const {password,...others}=hoteladmin._doc;
                    const token =generateToken(hoteladmin._id)
                    // console.log(token)
                    // res.status(200).json({token,others}); 
                    
                    res.status(200).json({
                        _id:hoteladmin.id,
                        ownername:hoteladmin.ownername,
                        name:hoteladmin.name,
                        address:hoteladmin.address,
                        gst:hoteladmin.gst,
                        email:hoteladmin.email,
                        contact:hoteladmin.contact,
                        subscriptionDate:hoteladmin.subscriptionDate,
                        expiryDate:hoteladmin.expiryDate,
                        role:hoteladmin.role,
                        selectedPlan:hoteladmin.selectedPlan,
                        token:token
                    })
                }
            }
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
};

exports.getallhotels=async(req,res)=>{
    try{
        let hotels;
        hotels=await HotelAdmin.find();
        res.status(200).json(hotels);

    }catch(err){
        res.status(400).json(err);
    }
};


const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}


exports.addsubscription=async(req,res)=>{
    const {planname,features}=req.body

    if(!planname || !features){
        return res.status(400).json("Please Enter the required details")
    }

    try{
    const newSubscriptionPlan=new SubscriptionForm({
        planname,
        features
    })

    const newplan=await newSubscriptionPlan.save();

    res.status(200).json(newplan);

    }catch(err){
        res.status(400).json(err);
    } 

};

exports.getsubscriptions=async(req,res)=>{

    try{
        let subscription;
        subscription=await SubscriptionForm.find();
        res.status(200).json(subscription);

    }catch(err){
        res.status(400).json(err);
    }

}


exports.gethoteldetailsById=async(req,res)=>{
    try{
        let hotel;
        hotel=await HotelAdmin.findById(req.params.hotelId);
        res.status(200).json(hotel);
    }catch(err){
        res.status(400).json(err);
    }
}


exports.updateHotelDetailsById=async(req,res)=>{

    const {ownername,hotelname,address,gst,email,contact,password,subscriptionDate,expiryDate,selectedPlan}=req.body;

    try{
         const filename=Date.now()+"_"+req.files.contract_path.name;
        const file=req.files.contract_path;
        let uploadPath=__dirname+"/upload/"+filename
        file.mv(uploadPath)
        const role="hoteladmin"
        const updatedHotelAdmin=await HotelAdmin.findByIdAndUpdate(req.params.hotelId,{
            $set:{
                ownername,
                hotelname,
                address,
                gst,
                email,
                contact,
                password,
                contract_path:uploadPath,
                subscriptionDate,
                expiryDate,
                selectedPlan,
                role   
            }
        },{new:true})

        res.status(200).json(updatedHotelAdmin);

    }catch(err){
        res.status(401).json("Hotel admin Can not be updatedf");
    }
}