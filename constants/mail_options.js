const { getWelcomEmailTemplate, getReportEmailTemplate } = require('./email_templates')
const cronstrue = require('cronstrue')


function welcomeEmailMailOptions(scheduled_screenshot) {
    const cronString = cronstrue.toString(scheduled_screenshot.cron)
    return {
        from: process.env.MAIL_USERNAME,
        to: scheduled_screenshot.email,
        subject: 'Welcome to captureME',
        html: getWelcomEmailTemplate(scheduled_screenshot.url, cronString)
    }
}



function reportEmailMailOptions(scheduled_screenshot, imageBuffer, fileName) {
    const cronString = cronstrue.toString(scheduled_screenshot.cron)

    return {
        from: process.env.MAIL_USERNAME,
        to: scheduled_screenshot.email,
        subject: 'CaputureME Screenshot report',
        html: getReportEmailTemplate(scheduled_screenshot.url, cronString),
        attachments: [
            {
                filename: fileName,
                content: imageBuffer,
            }
        ]
    }
}



module.exports = { welcomeEmailMailOptions, reportEmailMailOptions }