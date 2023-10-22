const express = require('express')
const router = express.Router()

//MIDDLEWARE
const validatation_middleware = require('../middleware/validate_params')
const screenshot_middleware = require('../middleware/screenshot')
const email_middleware = require('../middleware/email')
const filename_middleware = require('../middleware/filename')

//UTILITY 
const validateDelayedRouteParams = require('../utils/validate_delayed_route_params')



router.post('/', [validatation_middleware(validateDelayedRouteParams), screenshot_middleware, filename_middleware, email_middleware], (req, res) => {
    res.send({
        'message': `Screenshot report sent to ${req.body.userEmail}`,
        'time': new Date().toISOString()
    })
})

module.exports = router