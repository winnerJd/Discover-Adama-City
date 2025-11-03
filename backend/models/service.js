import mongoose from 'mongoose'
const serviceSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'please add a place name'],
        },
        description:{
            type:String,
            required:[true,'please add a description'],
        }
        ,location:{
            type:String,
            required:[true,'please add location']
        },
        phone:{
            type:String,
            required:[true,'please add phone number']
        },
        coordinates:{
            lat:{
                type:Number,
                required:[true,'please add latitude']
            },
            lng:{
                type:Number,
                required:[true,'please add longitude']
            }
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:[true,'please add a category']
        },
        images:[{
            type:String,
        }],
        videos:[{
            type:String,
        }],
        website:{
            type:String,
        },
        rating:{
            type:Number,
            default:0,
            min:0,
            max:5
        },
        tags: [String],
        reviews: [
            {
              user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              comment: String,
              stars: { type: Number, min: 1, max: 5 },
            },
          ],
    },  
        {timestamps:true}
)
const Service =mongoose.model('Service',serviceSchema)
export default Service