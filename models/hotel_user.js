const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    email:{type:String,
    required:true,
    unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{type:String,required:true},
    name:{type:String,required:true},
    raising:[]

},{timestamps:true});

const User=mongoose.model('hotel',userSchema);
module.exports=User;