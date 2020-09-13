require("../src/db/mongoose")
const User =require("../src/models/users")

const updateandcount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age})
    const count=await User.countDocuments({age})
    return count
}

updateandcount("5f510edbfea3540be0988bf8",2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)

})