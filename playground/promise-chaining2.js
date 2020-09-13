require("../src/db/mongoose")

const task=require("../src/models/task")

  const deletetaskandupdate=async(id)=>{
        const taskdeleted=await task.findByIdAndDelete(id)
        const count=await task.countDocuments({completed:false})
        return count
  }

  deletetaskandupdate("5f510f58dff44f2b44e18cae").then((count)=>{
        console.log(count)
  }).catch((e)=>{
    console.log(e)
  })