const express=require('express')
var moment = require('moment')
const axios=require('axios')
const router=express.Router()
const raising=require('../models/raising')
const exp=require('../models/exp')
const hotel=require('../models/hotel_user')
const NGO=require('../models/NGO_user')
let score=1000000;

async function helper(objects,map,sc,a,index,arr) {
  if(index>=Array.from(map.keys()).length) return
   let c=0;
   let copy={}
   Object.assign(copy,objects)
   let foodid=map.get(Array.from(map.keys())[index]);
   let fooddata = await raising.findById(foodid);
   fooddata=fooddata.items
   let r=false
   let sa=a.length
   fooddata.forEach(async(i)=>{
    console.log(i)
    for (key in i){
    let item=key
    if(Object.hasOwn(objects, item)&&objects[item]>0){
           //console.log(objects[item])
           //console.log(item)
           r=true
           a.push({"id":foodid,"item":key,"quantity":Math.min(objects[item],i[key]),"score":sc+Array.from(map.keys())[index]})
           objects[item]=objects[item]-i[key]
           if(objects[item]<0) objects[item]=0
    }
    for (const key in objects) {
      if(objects[key]===0) ++c;
    }
    if(r===true&&c===Object.keys(objects).length){
      if(sc+Array.from(map.keys())[index]<score) {
       score=sc+Array.from(map.keys())[index]
       console.log(a)
       Object.assign(arr,a);
       return
      }
 
  }
  c=0
    }
   })
   if(r===true){
   await helper(objects,map,sc+Array.from(map.keys())[index],a,index+1,arr)
   }
   if(r===true){
     let diff=a.length-r
     for(let j=0;j<diff;j++){
      a.pop()
     }
   }
   await helper(copy,map,sc,a,index+1,arr)


}
router.post('/', async(req,res)=>{
  let arr=[]
       let NGOdata = await NGO.findOne({email:req.body.email});
       await raising.find({}).then(async(data)=>{
        //let t1="";
        const t=await data.forEach(async (i) => {
          if (i.expiryTime <= new Date()) {
              try {
                  let hoteldata = await hotel.findOne({ email: i.email });
                  await raising.findByIdAndUpdate(i._id, { "status": "expired" });
                  //let shift = await raising.findByIdAndRemove(i._id);
                  // let newExpDoc = await exp.create({
                  //     "email": shift.email,
                  //     "items": shift.items,
                  //     "expiryTime": shift.expiryTime,
                  //     "status": shift.status
                  // });
                  // t1 = newExpDoc._id;
                  await hotel.findOne({"email":req.body.email}).then((hoteldata)=>{
                    
                   let array=hoteldata.raising
                   array.forEach(async(j,index)=>{
                      if(JSON.stringify(j._id)===JSON.stringify(i._id)){
                      j.status="expired"
                      array.set(index,j);
                      hoteldata.raising=array;
                      hoteldata.save()
                      return;
                      }
                    })})

                    
                  }
     catch (error) {
      console.error("Error processing document:", error);
      // Handle the error as needed
  }}})})
              
            //   console.log("Entries in 'raising' collection after modifications:");
            // const raisingEntries = await raising.find({});
            // console.log(raisingEntries);

            // // Print entries in 'exp' collection
            // console.log("\nEntries in 'exp' collection after modifications:");
            // const expEntries = await exp.find({});
            // console.log(expEntries);

          

      
      
                     
                    
           
            //let destination=NGOdata.address
            
            let destination="JIIT,Sec-62"
            let map2=new Map()
            let map1=new Map()
            let set=new Set()
          async function helper1(email){
            if(set.has(email)) {return false}
            else{
              set.add(email)
              return true
            }
          }
            await raising.find({}).then(async(dat)=>{
            
        for (const i of dat) {
            let src = await hotel.findOne({ email: i.email });
            source = "Dinanagar,Punjab";
           
            if(i.status==="pending"&&await helper1(i.email)){
            try {
                let d = await axios.get(`https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&key=QddmHYTMDVhDDmA6oMKO4JTA1cRZKBRg1UspHavOxWiEyUPAtikUDIleKcW3KVUi`);
                let distance = d.data.rows[0].elements[0].distance.text;
                let distanceTime = d.data.rows[0].elements[0].duration.text;
                map1.set(src._id, { "distance": distance, "Time": distanceTime });
      
                let obj=src.raising
                obj.forEach(async(o)=>{
                  if(o.status!=="expired"){
                  var secondsDiff = (o.expiryTime-new Date())/1000
                  secondsDiff/=60
                  console.log(secondsDiff);
                   
                   map2.set(parseInt(distance)*parseInt(secondsDiff)/10000,o._id)
                  }
                })
                console.log(map1);
                map2 = new Map([...map2].sort((a, b) => String(a[0]).localeCompare(b[0])))
                console.log(map2);
              } catch (error) {
                console.error("Error processing document:", error);
                // Handle the error as needed
            }  
          }     
        }

        
      })
      console.log(req.body.required)
      let r=await helper(req.body.required,map2,0,[],0,arr)
      console.log("outer")
      console.log(arr)
      return res.json("done")
      })

      
      
    
    
module.exports=router