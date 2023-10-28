const express=require('express')
const router=express.Router()
const raising=require('../models/raising')
const hotel=require('../models/hotel_user')
router.get('/', async(req,res)=>{
       let hoteldata = await hotel.findOne({email:req.body.email});
        let data =await raising.find({});

             data.forEach(async(i)=>{
                if(i.expiryTime<=new Date()){
                     await raising.findByIdAndUpdate(i._id,{"status":"expired"});
                     array=hoteldata.raising
                     array.forEach(async(j,index)=>{
                        if(JSON.stringify(j._id)===JSON.stringify(i._id)){
                        j.status="expired"
                        array.set(index,j);
                        hoteldata.raising=array;
                        hoteldata.save()
                        return;
                        }
            })}})
        return res.json("done")
      })

module.exports=router