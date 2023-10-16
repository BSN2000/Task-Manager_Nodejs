const mongoose = require('mongoose')
const validator = require('validator')

const tasksSchema = mongoose.Schema({
    desc:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Tasks = mongoose.model('Tasks',tasksSchema)

module.exports = Tasks