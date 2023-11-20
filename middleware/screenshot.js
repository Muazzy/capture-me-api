const takeScreenshot = require('../repository/screenshot')

async function screenshot(req, res, next) {
    try {
        const imageBuffer = await takeScreenshot(req.body.url, req.body.device)
        req.imageBuffer = imageBuffer
        next()
    } catch (e) {
        console.log('error in screenshot')
        console.log(e)
        return res.status(500).send('server error')
    }
}


module.exports = screenshot