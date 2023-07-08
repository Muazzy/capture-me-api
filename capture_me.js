const puppeteer = require('puppeteer')
const getNewFilePath = require('./get_new_file_path')

const puppeteerLaunchArgs = {
    defaultViewport: false,
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

async function captureMe(url, path, { fullPage }) {
    try {
        const browser = await puppeteer.launch(puppeteerLaunchArgs)
        const page = await browser.newPage()
        await page.goto(url)
        await page.waitForNetworkIdle()
        const newImagePath = getNewFilePath(path)
        await page.screenshot({ path: newImagePath, type: 'png', fullPage: fullPage || true })
        await browser.close()
        return newImagePath
    } catch (e) {
        console.log(e)
        throw e //rethrow for the post request to handle
    }
}


module.exports = captureMe