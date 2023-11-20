const takeScreenshot = require('../repository/screenshot')
const sendEmail = require('../repository/email')

const getFileName = require('../utils/unique_filename')


const { reportEmailMailOptions } = require('../constants/mail_options')


module.exports = async function (scheduled_screenshot) {
    try {
        console.log('start')
        const imageBuffer = await takeScreenshot(scheduled_screenshot.url, scheduled_screenshot.device)
        console.log('ss complete')
        const fileName = getFileName()
        console.log('filename complete')
        await sendEmail(reportEmailMailOptions(scheduled_screenshot, imageBuffer, fileName))
        console.log('email complete')
    }
    catch (e) {
        console.log('error in schedule.js')
        console.log(e)
    }
}