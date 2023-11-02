var jwt = require('jsonwebtoken');
const express=require('express')
const router=express.Router()
var bcrypt = require('bcryptjs');
const User=require('../models/delivery_user');
const {body,validationResult}=require('express-validator')
const jwtkey=require('../keys')
router.post('/',[
    body('email','Enter a valid email').isEmail(),
body('password','Password must be atleast 5 characters').isLength({min:5})
],(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   User.findOne({"email":req.body.email})
   .then((checker)=>{
   if(checker){
        bcrypt.compare(req.body.password, checker.password, function(err, vali) {
        if(vali===true){
          const tok=  jwt.sign({
                data: checker._id,
              }, jwtkey, { expiresIn: '1h' });
              res.user={"id":checker._id}
              res.cookie("jwt",tok);
              return res.status(200).json({msg:"Sucessfully logged in"})
              
        }
        else{
            return res.status(400).json({errors:{msg:"Invalid credentials"}})
            }
    });
   }
   else{
   return res.status(400).json({errors:{msg:"Invalid credentials"}})
   }
   
})})

module.exports=router