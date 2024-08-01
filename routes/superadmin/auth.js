const router=require("express").Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require('../../models/User');

router.post("/superadmin/register", async (req,res)=>{
    try{
    const{email,password,passwordCheck,mobile}=req.body;
    
    if(!email|| !password|| !passwordCheck|| !mobile){

       return res.status(400).json("Please Enter All the fields")
    }
    
    else if(password.length<6||password.length>12){
      return  res.status(400).json("password must be 6 to 12 characters long")
    }

    else if(password !== passwordCheck){
       return res.status(400).json("password and confirm password must be same")
    }

    const existingUser= await User.findOne({email:email});
    // console.log(existingUser) 
    if(existingUser){
       return  res.status(400).json("This Email is already exist.Please Enter a new Email Id")
    }


    if (displayName) displayName = email;
    console.log(displayName)
    try{
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const role="superadmin"
    const newUser = new User({
    email,
    password: passwordHash,
    mobile,
    role,
    });

    const savedUser = await newUser.save();
    const token =generateToken(savedUser._id)
    
    res.status(200).json({token,savedUser});

    }catch(err){
        res.status(400).json(err)
        console.log(err)
    }
    

    }catch(err){
        res.status(500).json(err);
    }
})



router.post("/superadmin/login",async (req,res)=>{

    try{
        const user= await User.findOne({email:req.body.email});
        
        if(!user){
           return res.status(400).json("Wrong Credentials !")
            }
        else{
            const validated=await bcrypt.compare(req.body.password,user.password);

            if( !validated ){
               return res.status(400).json("Wrong Credentials !")
                }else{
                    const {password,...others}=user._doc;
                    const token =generateToken(user._id)
                    // console.log(token)
                    // res.status(200).json({token,others}); 
                    
                    res.status(200).json({
                        _id:user.id,
                        email:user.email,
                        mobile:user.mobile,
                        role:user.role,
                        token:token
                    })
                }
            }
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }

})


const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}



module.exports=router;