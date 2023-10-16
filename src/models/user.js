const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be Password')
            }
        }
    },
    age:{
        type : Number
    },
    avatar:{
        type : Buffer
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
        timestamps:true
})

userSchema.methods.generateUserToken = async function() {
    const user =  this

    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })

    await user.save()
    
    return token

}

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function() {
    var userObject = this.toObject()

    console.log('start')
    console.log(userObject)

    delete userObject.password
    delete userObject.tokens

    console.log(userObject)

    return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

userSchema.pre('save',async function(next){
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User