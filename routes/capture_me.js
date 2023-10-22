const express = require('express')
const router = express.Router()

//MIDDLEWARE
const validatation_middleware = require('../middleware/validate_params')
const screenshot_middleware = require('../middleware/screenshot')
const cloud_storage_middleware = require('../middleware/store')
const fileNameMiddleware = require('../middleware/filename')

//UTILITY 
const validate_params = require('../utils/validate_params')


router.post('/', [validatation_middleware(validate_params), screenshot_middleware, fileNameMiddleware, cloud_storage_middleware], (req, res) => {
    const expires_in = new Date(Date.now() + (60 * 60 * 24 * 1000)) // adding 24hrs
    res.send({
        'url': req.ssUrl,
        'expires_in': expires_in.toISOString(),
    })
})

module.exports = router