const nodemailer = require('nodemailer')

module.exports = async function (req, res, next) {

    console.log('email is')
    console.log(req.body.userEmail)

    if (!req.newFileName || !req.imageBuffer || !req.body.userEmail) {

        console.log('no image buffer or filename provided')
        return res.status(500).send('something shit went down')
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

        let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: req.body.userEmail,
            subject: 'this is a test mail v2, and im happy yeah',
            text: 'Hello new',
            attachments: [
                {
                    filename: req.newFileName,
                    content: req.imageBuffer,
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        next()
    }
    catch (e) {
        console.log('error in nodemailer')
        console.log(e)
        return res.status(500).send('server error')
    }
}