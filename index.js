const express = require('express')
const prepareDir = require('./prepare_dir')
const getBaseUrl = require('./get_base_url')
const validateUrl = require('./validate_url')
const captureMe = require('./capture_me')
const cleanTemporaryFiles = require('./clean_temporary_files')



require("dotenv").config()

const app = express()


const PORT = process.env.PORT || 3069
const ssDir = 'screenshots'

app.use(express.json()) //using json middleware to parse the body of the post request
app.use(express.urlencoded({ extended: true }))
app.use(express.static(ssDir)) //we can directly access the files of the screenshot path using this : ourbaseapipath/filename (note the file should be in the )


app.post('/api/captureme', async (req, res) => {
    //IF URL IS NOT GIVEN
    const url = req.body.url
    if (!url) return res.status(400).send('url is required')
    //IF URL IS NOT VALID
    const isValidUrl = validateUrl(url)
    if (!isValidUrl) return res.status(400).send('invalid url')

    //CHECK IF THE DIR IS PREPARED, IF ITS NOT, RETURN A SERVER ERROR
    const isDirReady = await prepareDir(ssDir).catch((e) => { return false }) //on success the function returns true by default
    if (!isDirReady) return res.status(500).send('Something unexpected happened on the server')

    //FINALLY RUN THE CAPTUREME FUNCTION 
    let resultSsPath = ''
    try {
        resultSsPath = await captureMe(url, ssDir, { fullPage: true })
        const baseUrl = getBaseUrl(req.protocol, req.headers.host)

        return res.send(`${baseUrl}${resultSsPath}`)
    } catch (e) {
        console.log(e)
        return res.status(500).send('Something unexpected happened on the server')
    }
})

//will be running this every hour
//1 => hour => 60 => mins => 60 => seconds => 1000 (miliseconds)
setInterval(() => {
    cleanTemporaryFiles(ssDir)
}, 1 * 60 * 60 * 1000)


app.listen(PORT, () => { console.log(`litsening to port ${PORT}`) })