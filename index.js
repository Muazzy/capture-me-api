const express = require('express')
const prepareDir = require('./prepare_dir')
const getBaseUrl = require('./get_base_url')
const validateUrl = require('./validate_url')
const captureMe = require('./capture_me')

require("dotenv").config()

const app = express()


const PORT = process.env.PORT || 3069
const ssPath = 'screenshots'

app.use(express.json()) //using json middleware to parse the body of the post request
app.use(express.urlencoded({ extended: true }))
app.use(express.static(ssPath)) //we can directly access the files of the screenshot path using this : ourbaseapipath/filename (note the file should be in the )


app.post('/api/captureme', async (req, res) => {
    //IF URL IS NOT GIVEN
    const url = req.body.url
    if (!url) return res.status(400).send('url is required')
    //IF URL IS NOT VALID
    const isValidUrl = validateUrl(url)
    if (!isValidUrl) return res.status(400).send('invalid url')

    //CHECK IF THE DIR IS PREPARED, IF ITS NOT, RETURN A SERVER ERROR
    const isDirReady = await prepareDir(ssPath).catch((e) => { return false }) //on success the function returns true by default
    if (!isDirReady) return res.status(500).send('Something unexpected happened on the server')

    console.log('isDirReady', isDirReady)

    const baseUrl = getBaseUrl(req.protocol, req.headers.host)
    // captureSS(url)
    res.send(`${baseUrl}hello.png`)
})















app.listen(PORT, () => { console.log(`litsening to port ${PORT}`) })