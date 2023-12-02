const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    fromemail:{type:String,
    required:true
    },
    toemail:{type:String,
        required:true
        },
    item:{type:String},
    quantity:{type:Number},
    raisedId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "raising"
        
    }

},{timestamps:true});

const User=mongoose.model('donated',userSchema);
module.exports=User;