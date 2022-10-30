require('dotenv').config()

const express = require ('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors')

app.use(cors()) // allow cross-origin requests

app.use(express.json())

mongoose.connect(process.env.DATABASE_USER_URL, { useNewUrlParser: true, useUnifiedTopology: true}
    , err => {
        if(err) throw err
        console.log('Connected to user Database')
    })

const userData = require('./routes/home/dataUser')
app.use('/api/home', userData)
app.listen(3000, () => console.log('Server running on port 3000'))