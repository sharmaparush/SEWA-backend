const express=require('express')
var moment = require('moment')
const axios=require('axios')
const router=express.Router()
const raising=require('../models/raising')
const hotel=require('../models/hotel_user')
const NGO=require('../models/NGO_user')
const checkIfKeyExist = (objectName, keyName) => {
  let keyExist = Object.keys(objectName).some(key => key === keyName);
  return keyExist;
};
async function helper(objects,map,sc,a,index,arr,score) {
  if(index>=Array.from(map.keys()).length) return
   let c=0;
   let copy={}
   Object.assign(copy,objects)
   let foodid=map.get(Array.from(map.keys())[index]);
   let fooddata = await raising.findById(foodid);
   fooddata=fooddata.items
   let r=false
   let sa=a.length
   for( let i of fooddata){
    for (key in i){
    let item=key
    if(checkIfKeyExist(objects, item)&&objects[item]!==0){
           
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
       Object.assign(arr,a);
       return
      }
    
 
  }
  c=0
    }
   }
   if(r===true){
   await helper(objects,map,sc+Array.from(map.keys())[index],a,index+1,arr,score)
   }
   if(r===true){
     let diff=a.length-sa
     for(let j=0;j<diff;j++){
      a.pop()
     }
   }
   await helper(copy,map,sc,a,index+1,arr,score)


}
router.post('/', async(req,res)=>{
  let arr=[]
  let score=1000000;
   let t
   if(req.cookies.pid){
    t=req.cookies.pid
  }
  else{
    t=req.body.pid
  }
       let NGOdata = await NGO.findOne({email:t});
       await raising.find({}).then(async(data)=>{
        //let t1="";
          for(let i of data) {
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
                  await hotel.findOne({"email":t}).then(async (hoteldata)=>{
                    
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
  }}}})
              
            let destination
            await NGO.findOne({email:t}).then((hulu)=>{
              destination=hulu.address
            })    
            //let 
            
            //let destination="JIIT,Sec-62"
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
           
        for (let i of dat) {
           let source
             await hotel.findOne({ email: i.email }).then((hote)=>{
              source = hote.address;
           
            })
            let src=await hotel.findOne({email:i.email})
    
            if(i.status==="pending"&&await helper1(i.email)){
            try {
                let d = await axios.get(`https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&key=QddmHYTMDVhDDmA6oMKO4JTA1cRZKBRg1UspHavOxWiEyUPAtikUDIleKcW3KVUi`);
                
                let distance = d.data.rows[0].elements[0].distance.text;
                let distanceTime = d.data.rows[0].elements[0].duration.text;
                map1.set(src._id.toString(), { "distance": distance, "Time": distanceTime });
      
                let obj=src.raising
                for( o of obj){
                  if(o.status!=="expired"){
                  var secondsDiff = (o.expiryTime-new Date())/1000
                  
                  
                   var e=parseInt(distance)*parseInt(secondsDiff)/10000
                   
                   if(e>=0){
                    
                   map2.set(e,o._id)}
                  }
                }
                //console.log(map1)
                map2 = new Map([...map2].sort((a, b) => String(a[0]).localeCompare(b[0])))
                //console.log(map2)
              } catch (error) {
                console.error("Error processing document:", error);
                // Handle the error as needed
            }  
          }     
        }

        
      })
      let front=[]
      async function helplast(){
       
        for(let i of arr){
          
          await raising.findById(i.id).then(async(raised)=>{
            //console.log(raised)
           
            await hotel.findOne({"email":raised.email}).then((hoteli)=>{
              
              var pot=(map1.get(hoteli._id.toString()))
              var give={
                 "email":raised.email,
                 "name":hoteli.name,
                 "address":hoteli.address,
                 "item":i.item,
                 "quantity":i.quantity,
                 "time": pot["Time"],
                 "distance": pot["distance"]
  
              }
              //console.log(give)
              front.push(give)
              //console.log(front.length)
            })
              
         })
  
         }

         
         
        
      }
      
      await helper(req.body.required,map2,0,[],0,arr,score).then(async()=>{
        console.log(arr)
        await helplast()
        for(let i of arr){
          await raising.findById(i.id).then(async (hot)=>{
            var items1=hot.items
            for(let j of items1){
              if(checkIfKeyExist(j,i.item)&&j[i.item]>0){
                
                j[i.item]-=i.quantity
                
                hot.items=items1
                console.log(hot.items)
                await raising.findByIdAndUpdate(i.id,{items:hot.items})
                let u=await raising.findById(i._id)
                // await hotel.findOne({email:hot.email}).then((ter)=>{
                //     let raisingA=ter.raising
                //     for(let k=0;k<raising.length;k++){
                //       console.log(raisingA[k])
                //       if(raisingA[k]===i.id){
                //            raisingA.set(k,u)
                //            ter.raising=raisingA
                //            console.log(ter.raising)
                //            ter.save();
                //       }
                //     }

                // })
              }
            }
          })
        }
        front.sort((a,b)=>{
          var tr=parseInt(a.time)
          var rt=parseInt(b.time)
          return tr-rt
        })
        return res.json(front)
        
})
      
       
      
       
        
     
      
      
      })

      
      
    
    
module.exports=router