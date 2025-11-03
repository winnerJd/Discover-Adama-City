import mongoose from 'mongoose'
const userSchema=new mongoose.Schema({
name:{
    type:String,
    reqquired:[true,'please add a name'],
    trim:true
},
email:{
    type:String,
    required:[true,'please add an email'],
unique:true,
match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'please add a valid email']
},
password:{
    type:String,
    required:[true,'please add a password'],
    minlength:8,
    select:false
},
role:{
    type:String,
    enum:['user','admin'],
    default:'user'
},
},
{timestamps:true})
export default mongoose.model('User',userSchema) 