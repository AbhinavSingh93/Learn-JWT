const router=require("express").Router();
const { check,validationResult }=require("express-validator");
const{ users } =require("../db");
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");

router.post('/signup',[
  check("email","Please provide a valid email")
     .isEmail(),
  check("password","Please provide a password that is greater than 5 characters")
     .isLength({
      min:6
     })
],async(req,res)=>{
  const{password,email}=req.body;
  //Validated the input
  const errors=validationResult(req)
  
  if(!errors.isEmpty()) {
    return res.status(400).json({
      error:errors.array()
    })
  }
 //Validate if user doesnt already exist

  let user=users.find((user)=>{
    return user.email===email
  })

  if(user)
  {
    return res.status(400).json({
        "error": [
            {
                "msg": "This user already exist",
            }
        ]
    })
  }

  const hashedPassword=await bcrypt.hash(password,10);
  users.push({
      email,
      password: hashedPassword
  });

  const token=await JWT.sign({
    email
  },"cbchdsbcisbubcubhubcusb",{
    expiresIn:36000000
  })

  res.json({
    token
  })
})


router.post('/login',async(req,res)=>{
  const {password,email}=req.body;

  let user=users.find((user)=>{
    return user.email===email
  });

  if(!user)
    {
      return res.status(400).json({
          "error": [
              {
                  "msg": "Invalid credentials",
              }
          ]
      })
    };

   let isMatch= await bcrypt.compare(password,user.password);

   if(!isMatch)
    {
      return res.status(400).json({
          "error": [
              {
                  "msg": "Invalid credentials",
              }
          ]
      })
    };

    const token=await JWT.sign({
      email
    },"cbchdsbcisbubcubhubcusb",{
      expiresIn:36000000
    })
  
    res.json({
      token
    })

})

router.get("/all",(req,res)=>{
  res.json(users);
})



module.exports=router;