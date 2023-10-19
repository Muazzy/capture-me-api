const puppeteer = require('puppeteer')

const puppeteerLaunchArgs = {
    defaultViewport: null,
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        // `--window-size=20,100` //not the right way
    ],
    executablePath:
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    headless: true
}

const iphone = puppeteer.KnownDevices['iPhone X']
const android = puppeteer.KnownDevices['Pixel 4a (5G)']

async function screenshot(req, res, next) {
    try {
        const params = req.body
        const browser = await puppeteer.launch(puppeteerLaunchArgs)
        const page = await browser.newPage()

        if (params.device) {
            if (params.device.toUpperCase() === 'I') {
                await page.emulate(iphone)
            }
            if (params.device.toUpperCase() === 'A') {
                await page.emulate(android)
            }
        }

        page.setDefaultNavigationTimeout(0) //For the page to be fully loaded
        page.setDefaultTimeout(0)

        await page.goto(params.url)
        await page.waitForNetworkIdle()

        const imageBuffer = await page.screenshot({ type: 'png', fullPage: params.fullPage ?? true })

        await browser.close()

        req.imageBuffer = imageBuffer
        next()
    } catch (e) {
        console.log('error in screenshot')
        console.log(e)
        return res.status(500).send('server error')
    }
}


module.exports = screenshot