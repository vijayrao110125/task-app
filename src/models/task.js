const mongoose=require('mongoose')

const taskschema=mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{
    timestamps:true
})
const Task=mongoose.model("task",taskschema)

module.exports=Task