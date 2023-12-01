const express=require('express')
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const router=express.Router()
const Data=require('../models/raising')
const hotel=require('../models/hotel_user')
router.post('/',async(req,res)=>{
    

   
    
    // ISTTime now represents the time in IST coordinates
    
   
    




        //Data.collection.createIndex({"DateTime":1},{expireAfterSeconds:req.body.left*60})
          var d1=new Date()
          
          
          var t=req.cookies.pid
        //   var ISTOffset = 330;   // IST offset UTC +5:30 
        //   offset=ISTOffset*60*1000
        //   d1 = new Date(d1.getTime() + offset);
        //   console.log(d1)
        //console.log(req.body.)
          d1.setHours(d1.getHours() + req.body.left);
          //console.log(d1);
          //d1.setMinutes(d1.getMinutes()+req.body.left*60)
          var w=req.body
          w.status="pending"
          w.email=t
          w.expiryTime=d1
         Data.create(w).then((check)=>{
            hotel.findOne({"email":t})
            .then((hoteluser)=>{
                
                hoteluser.raising.push(check);
                hoteluser.save()
                
           
        //return res.status(200).json({msg:"Sucessfully raised"})
    


   

    
        let config = {
            service : 'gmail',
            auth : {
                user: 'parushsharma48@gmail.com',
                pass: 'cuvtblbgfyqsocyn'
            }
        }
    
        let transporter = nodemailer.createTransport(config);
    
        let MailGenerator = new Mailgen({
            theme: "default",
            product : {
                name: "SEWA",
                link : 'https://mailgen.js/'
            }
        })
        var q=[]
        
        req.body.items.forEach(async(i)=>{
             var p={
                "item":Object.keys(i)[0],
                "description":i[Object.keys(i)[0]],
                "Expirying in":req.body.left+" Hours"
             }
             q.push(p);
        })
        let response = {
            body: {
                name : hoteluser.name,
                intro: "The given items has been raised for donation",
                table : {
                    
                    data : q
                },
                outro: "Looking forward to help more people"
            }
        }
    
        let mail = MailGenerator.generate(response)
    
        let message = {
            from : 'parushsharma48@gmail.com',
            to : req.body.email,
            subject: "Raised",
            html: mail
        }
    
        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "Successfully raised"
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
    
    })})
})
module.exports=router