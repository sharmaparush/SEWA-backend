const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    email:{type:String,
    required:true
    },
    items:[],
    expiryTime:{type:Object,required:true},
    status:{type:String}

},{timestamps:true});

const User=mongoose.model('raising',userSchema);
module.exports=User;