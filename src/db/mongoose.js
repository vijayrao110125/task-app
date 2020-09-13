const mongoose=require('mongoose')
const validator=require('validator')
mongoose.connect("mongodb://127.0.0.1:27017/task-app-api",{
    useNewUrlParser:true,
    useCreateIndex:true
})


// const me=user({
//     name:'vijay Rao',
//     email:'vijay@gmail.com',
//     age:20,
//     password:'Vijayrao123'
// })

// me.save().then((result)=>{
// console.log(result)
// }).catch((error)=>{
// console.log(error)
// })

// const task=new Task({
//     description:'learn the subject',
    
// })

// task.save().then((result)=>{
// console.log(result)
// }).catch((error)=>{
// console.log(error)
// })