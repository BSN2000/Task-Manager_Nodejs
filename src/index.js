const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT

app.listen(port,()=>{
    console.log('listening to server at port '+port)
})

