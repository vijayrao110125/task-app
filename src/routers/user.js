const express=require("express")
const User=require("../models/users")
const auth=require("../middleware/auth")
const multer=require('multer')
const sharp=require("sharp")
const router=express.Router()


router.post('/users',async (req,res)=>{
    const user=User(req.body)
    try{
        await user.save()
        const token=await user.generatewebtoken()
        return res.status(201).send({user,token})
    }catch(e){
        return res.status(400).send(e)
    }
})
router.post("/users/login",async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generatewebtoken()
        res.send({user,token})
    }catch(e){
        res.status(400).send("error")
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post("/users/logoutAll",auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get("/users/me",auth,async (req,res)=>{
   res.send(req.user)
})
router.get("/users/:id",async (req,res)=>{
    const id=req.params.id
    try{
        const user=await User.findById(id)
        if(!user){
            return res.status(404).send(user)
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch("/users/me",auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const validupdates=["name","password","email","age"]
    const isvalidupdates=updates.every((update)=>validupdates.includes(update))

    if(!isvalidupdates){
        return res.status(400).send({'error':"invalid updates!"})
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        //const update=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})


const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error("please upload an image"))
        }
        cb(undefined,true)
    }
})
router.post("/users/me/avater",auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avater=buffer
    await req.user.save()
res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete("/users/me/avater",auth,async(req,res)=>{
    req.user.avater=undefined
    await req.user.save()
    res.send()
})

router.get("/users/:id/avater",async(req,res)=>{
    try{
    const user=await User.findById(req.params.id)
    if(!user || !user.avater){
        throw new Error()
    }
    res.set('Content-Type','image/jpg')
    res.send(user.avater)
    }catch(e){
        res.status(400).send()
    }
})



module.exports=router