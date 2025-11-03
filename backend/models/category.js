import mongoose from 'mongoose'
const categorySchema=new mongoose.Schema({

name:{
    type:String,
    required:[true,'please add a name'],
    trim:true,
    unique: true
},


},{ timestamps:true
    
})
const category=mongoose.model('Category',categorySchema)
export default category