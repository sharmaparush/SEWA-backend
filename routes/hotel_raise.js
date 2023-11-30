const express=require('express')
const router=express.Router()
const Data=require('../models/raising')
const hotel=require('../models/hotel_user')
router.post('/',(req,res)=>{
    
        //Data.collection.createIndex({"DateTime":1},{expireAfterSeconds:req.body.left*60})
          var d1=new Date();
          d1.setHours(d1.getHours() + req.body.left);
          console.log(d1);
          //d1.setMinutes(d1.getMinutes()+req.body.left*60)
          var w=req.body
          w.status="pending"
          w.expiryTime=d1
         Data.create(w).then((check)=>{
            hotel.findOne({email:req.body.email})
            .then((hoteluser)=>{
                hoteluser.raising.push(check);
                hoteluser.save()
                
            })})
        return res.status(200).json({msg:"Sucessfully raised"})
    })

module.exports=router