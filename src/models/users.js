const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwttoken=require("jsonwebtoken")
const Task = require('./task')
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid")
            }
        }

    },
    password:{
        type:String,
        minlength:7,
        trim:true,
        required:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('password cannot contain "password"')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age should be positive")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avater:{
        type:Buffer
    }

},{
    timestamps:true
})

userschema.virtual('task',{
    ref:"task",
    localField:'_id',
    foreignField:"owner"
})


userschema.methods.generatewebtoken=async function(){
    const user=this
    const token=jwttoken.sign({_id:user._id.toString()},"thisisvijayrao")
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}


userschema.methods.toJSON=function(){
const user=this
const userobject=user.toObject()
delete userobject.password
delete userobject.tokens
return userobject
}
userschema.statics.findByCredentials=async (email,password)=>{
const user=await User.findOne({email})
if(!user){
    throw new Error('Unable to login!')
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    throw new Error("unable to login!1")
}

return user
}

userschema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

next()
})
userschema.pre('remove',async function (next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('user',userschema)
module.exports=User