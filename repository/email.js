const nodemailer = require('nodemailer')

module.exports = async function (mailOptions) {

    if (!mailOptions) {
        console.log('no mail options provided')
        throw new Error('one of the parameters not provided')
    }

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });

        await transporter.sendMail(mailOptions);
    }
    catch (e) {
        console.log('error in nodemailer')
        console.log(e)
        console.log(e.message)
        throw e
    }
}