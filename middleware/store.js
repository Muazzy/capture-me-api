const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const getUniqueFileName = require('../utils/unique_filename')

async function storeScreenshot(req, res, next) {
    try {
        const newFileName = getUniqueFileName()
        const screenshotPath = process.env.SCREENSHOTS_PATH_ID
        const S3 = new S3Client({
            region: 'auto',
            endpoint: process.env.API_ENDPOINT,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        });

        await S3.send(
            new PutObjectCommand({
                Body: req.imageBuffer,
                Bucket: process.env.BUCKET_NAME,
                Key: `${screenshotPath}/${newFileName}`,
                ContentType: 'image/png',
            })
        );

        const encodedSlash = encodeURIComponent('/')

        req.ssUrl = `${process.env.PUBLIC_ACCESS_ENDPOINT}/${screenshotPath}${encodedSlash}${newFileName}`
        console.log(req.ssUrl)

        next()
    }
    catch (e) {
        console.log('error in store')
        console.log(e)
        return res.status(500).send('server error')
    }

}


module.exports = storeScreenshot