const PORT = process.env.PORT || 3069

require("dotenv").config()
//DB
const mongoose = require('mongoose')

const express = require('express')
const app = express()

//ROUTES
const captureme_routes = require('./routes/capture_me')
const schedule_routes = require('./routes/schedule')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/captureme', captureme_routes)
app.use('/api/schedule', schedule_routes)


mongoose.connect(process.env.MONGODB_URL).then((_) => {
    console.log(`connected to ${process.env.MONGODB_URL}`)
}).catch(e => {
    console.log(e)
    process.exit(1) //exit the application if it can't connect to database
})

app.listen(PORT, () => { console.log(`litsening to port ${PORT}`) })

//TODO: Feature: filters to the ss