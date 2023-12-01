var jwt = require('jsonwebtoken');
const express=require('express')
const router=express.Router()
var bcrypt = require('bcryptjs');
const User=require('../models/NGO_user');
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
              res.cookie("jwt",tok)
              res.cookie("pid",req.body.email)
              return res.send({"jwt":tok,"pid":req.body.email})
              
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