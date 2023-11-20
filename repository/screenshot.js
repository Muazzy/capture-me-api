const puppeteer = require('puppeteer')

const puppeteerLaunchArgs = {
    defaultViewport: null,
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
    ],
    executablePath:
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    headless: true
}

const iphone = puppeteer.KnownDevices['iPhone X']
const android = puppeteer.KnownDevices['Pixel 4a (5G)']

async function screenshot(url, device) {
    try {
        const browser = await puppeteer.launch(puppeteerLaunchArgs)
        const page = await browser.newPage()

        if (device) {
            if (device.toUpperCase() === 'I') {
                await page.emulate(iphone)
            }
            if (device.toUpperCase() === 'A') {
                await page.emulate(android)
            }
        }

        page.setDefaultNavigationTimeout(0) //For the page to be fully loaded
        page.setDefaultTimeout(0)

        await page.goto(url)
        await page.waitForNetworkIdle()

        const imageBuffer = await page.screenshot({ type: 'png', fullPage: true })

        await browser.close()

        return imageBuffer
    } catch (e) {
        console.log('error in screenshot')
        console.log(e)
        throw e
    }
}

module.exports = screenshot