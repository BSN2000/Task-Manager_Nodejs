const express = require('express')
const Tasks  = require('../models/task')
const auth = require('../middleware/auth')
const { formatSortValue } = require('mongodb/lib/utils')
const route = express.Router()

//Task
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=1
// GET /tasks?sortBy=completed:desc
route.get('/tasks',auth,async (req,res)=>{
    var val = false
    if(req.query.completed){
        val.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        const val = parts[0]
        const sort =parts[1] === 'desc' ? -1 : 1
    }

    try{
        const task  = await Tasks.find({owner:req.user._id,completed:val}).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort({'createdAt':1})
        return res.status(200).send(task)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

})

route.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id

    try{
        const task = await Tasks.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send("Task Not found error")
        }else{
            res.status(200).send(task)
        }
    }catch(e){
        res.status(500).send(e)
    }

})

route.post('/tasks',auth,async (req,res)=>{
    const task = new Tasks({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }

})

route.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['desc','completed']
    const isValidOperations = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperations){
        return res.status(400).send('Invalid Updates')
    }

    try{
        const task = await Tasks.findOne({_id:req.params.id,owner:req.user._id})

        // const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send("Task Not found error")
        }

        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()

        res.send(task)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

route.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task  = await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(404).send("Task Not found error")
        }else{
            res.status(200).send(task)
        }
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = route