var jwt = require('jsonwebtoken')
const express=require('express')
const router=express.Router()
var bcrypt = require('bcryptjs');
const User=require('../models/NGO_user')
const {body,validationResult}=require('express-validator')
const jwtkey=require('../keys')

router.post('/',[
body('name','Enter a valid name').isLength({min:3}),
body('email','Enter a valid email').isEmail(),
body('password','Password must be atleast 5 characters').isLength({min:5})

], (req,res)=>{
    console.log(req.body)
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    
    if(req.body.password!=req.body.confirm_password){
        return res.status(400).json({errors:{msg:"Password and confirm password should be same"}})
    }
    User.findOne({email:req.body.email})
    .then((checker)=>{
    if(checker){
        return res.status(400).json({errors:{msg:"user already exists"}})
    }
    else{
        
     bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            User.create({name:req.body.name,email:req.body.email,password:hash,address:req.body.address}).then((checker)=>{
               const tok= jwt.sign({
                    data: checker._id,
                  }, jwtkey, { expiresIn: '1h' });
                  return res.send(tok);
                  
            });
        });
    });
    
}
})})
module.exports=router