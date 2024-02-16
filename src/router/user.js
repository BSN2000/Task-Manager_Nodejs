const express = require('express')
const User  = require('../models/user')
const route = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')
const multer = require('multer')
const sharp = require('sharp')

//User
route.post('/users',async (req,res)=>{
    const user =new User(req.body)

    try{
        await user.save()
        const userToken = await user.generateUserToken()
        return res.status(201).send({ user , userToken })
    }catch(e){
        res.status(400).send(e)
    }
})

route.get('/users',auth,async (req,res)=>{


    res.send(req.user)
})

route.post('/users/login',async (req,res)=>{
    try{
        const user  = await User.findByCredentials(req.body.email,req.body.password)
        const userToken = await user.generateUserToken()
        res.status(200).send({ user , userToken})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

route.post('/users/logout', auth , async ( req,res ) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()

        res.send(200)

    }catch(e){
        res.status(500).send(e)
    }
})

route.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()

        res.send(200)
    }catch(e){
        res.status(500).send(e)
    }
})

route.get('/users/:id',async (req,res)=>{
    const id = req.params.id

    try{
        const user = await User.findById(id)
        if(!user){
            res.status(404).send("User Not found error")
        }else{
            res.status(200).send(user)
        }
    }catch(e){
        res.status(500).send(e)
    }

})

route.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperations = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send('Invalid Updates')
    }

    try{
        const user  = req.user

        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

route.delete('/users/me',auth,async(req,res)=>{
    try {

        await User.deleteOne({ _id: req.user._id })
        await Task.deleteMany({owner:req.user._id})
        res.status(200).send(req.user);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined,true)
    }
})

route.post('/users/me/avatar', auth , upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

route.delete('/users/me/avatar', auth, async (req,res)=>{
    req.user.avatar =undefined
    await req.user.save()
    res.send()
})

route.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user  = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error('User Not found or profile pic not available')
        }

        res.set('Content-type','image/jpg')
        res.send(user.avatar)

    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = route