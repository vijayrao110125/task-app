const express=require('express')
require('./db/mongoose')
const userrouter=require("./routers/user")
const taskrouter=require("./routers/task")




const app=express()
const port=process.env.PORT||3000
app.use(express.json())
app.use(userrouter)
app.use(taskrouter)


app.listen(3000,()=>{
    console.log('server started...')
})





// const User=require("../src/models/users")
// const Task = require('./models/task')
// const main=async ()=>{
//     const user=await User.findById("5f53c6097cab6b44bcfddc34")
//     await user.populate('task').execPopulate()
//     console.log(user.task)
//     // const task=await Task.findById("5f53c62e7cab6b44bcfddc37")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

// }
// main()