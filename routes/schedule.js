const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const validatation_middleware = require('../middleware/validate_params')
const { ScheduledScreenshot, validate } = require('../model/scheduled_screenshot')
const schedule = require('../service/schedule')
const createCron = require('../utils/create_cron')
const deleteCron = require('../utils/delete_cron')
const sendEmail = require('../repository/email')
const { welcomeEmailMailOptions } = require('../constants/mail_options')


router.post('/', [validatation_middleware(validate)], async (req, res) => {
    try {
        const scheduled_ss = new ScheduledScreenshot({
            cron: req.body.cron,
            email: req.body.email,
            url: req.body.url,
            device: req.body.device,
        })

        createCron(scheduled_ss._id.toString(), scheduled_ss.cron, schedule, scheduled_ss)
        await scheduled_ss.save()

        sendEmail(welcomeEmailMailOptions(scheduled_ss)) //send confirmation email.
        res.send({
            "message": `you will recieve the scheduled screenshot reports on ${req.body.email}`,
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).send('something went wrong on the server')
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id

        console.log(`${id} in delete req in schedule route`)

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, no scheduled screenshot found')
        }

        const scheduled_ss = await ScheduledScreenshot.findById(id)
        if (!scheduled_ss) return res.status(404).send('scheduled screenshot not found')

        const deleted = deleteCron(id)

        console.log(`deleted is:`)
        console.log(deleted)

        if (!deleted) return res.status(500).send('something went wrong on the server')

        scheduled_ss.set({ running: false })
        await scheduled_ss.save()

        res.send({
            "message": `you will not recieve screenshot reports of this url:${scheduled_ss.url} anymore`,
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).send('something went wrong on the server')
    }
})

module.exports = router