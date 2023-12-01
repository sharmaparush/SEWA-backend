var jwt = require('jsonwebtoken');
const jwtkey=require('../keys');
const auth=(req,res,next)=>{
  if(req.body.jwt){
    const check=jwt.verify(req.body.jwt,jwtkey);
    req.user={"id":check.data}
    console.log("hii")
    console.log(req.user)
    next();
  }
  else{
  if(req.cookies.jwt){
    const check=jwt.verify(req.cookies.jwt,jwtkey);
    req.user={"id":check.data}
    console.log("byee")
    console.log(req.user)
    next();
  }
  else{
  return res.status(401).json({errors:{msg:"Unauthorised access login first"}})
}}}
module.exports= auth;
