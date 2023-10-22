require("dotenv").config()
const PORT = process.env.PORT || 3069
const express = require('express')
const app = express()

//ROUTES
const captureme_routes = require('./routes/capture_me')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v2/captureme', captureme_routes)

app.listen(PORT, () => { console.log(`litsening to port ${PORT}`) })


//TODO: Feature: filters to the ss