var jwt = require('jsonwebtoken');
const jwtkey=require('../keys');
const auth=(req,res,next)=>{
  if(req.body.jwt){
    const check=jwt.verify(req.body.jwt,jwtkey);
    req.user={"id":check.data}
    next();
  }
  else{
  return res.status(401).json({errors:{msg:"Unauthorised access login first"}})
}}
module.exports= auth;
