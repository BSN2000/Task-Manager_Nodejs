const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'thisismynewcourse')
        const user  = await User.findOne({_id:decode._id,'tokens.token':token})

        console.log("auth inside",user)

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        console.log(req.user)
        next()
    }catch(e){
        res.status(401).send("Authenication error")
    }
}

module.exports = auth