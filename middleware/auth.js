var jwt = require('jsonwebtoken');
const jwtkey=require('../keys');
const auth=(req,res,next)=>{
  if(req.cookies.jwt){
    const check=jwt.verify(req.cookies.jwt,jwtkey);
    req.user={"id":check.data}
    next();
  }
  else{
  return res.status(401).json({errors:{msg:"Unauthorised access login first"}})
}}
module.exports= auth;